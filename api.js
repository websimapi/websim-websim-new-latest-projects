export class WebsimAPI {
    constructor() {
        this.baseURL = '/api/v1';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.discoveryState = {
            trendingOffset: 0,
            searchTerms: ['game', 'app', 'tool', 'dashboard', 'portfolio', 'animation', 'interactive', 'visualization', 'calculator', 'generator'],
            currentSearchIndex: 0,
            lastDiscoveryTime: 0,
            rateLimitDelay: 2000, // 2 seconds between requests
            discoveredProjectIds: new Set(),
            totalDiscovered: 0
        };
    }

    async fetchWithCache(url, options = {}) {
        const cacheKey = `${url}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
            return data;
        } catch (error) {
            console.error('API Fetch Error:', error);
            throw error;
        }
    }

    async getRecentProjects(limit = 50, offset = 0) {
        const url = `${this.baseURL}/feed/trending?limit=${limit}&offset=${offset}&feed=new&range=day`;
        return this.fetchWithCache(url);
    }

    async searchProjects(query, limit = 20) {
        const encodedQuery = encodeURIComponent(query);
        const url = `${this.baseURL}/feed/search/newest/${encodedQuery}?limit=${limit}`;
        return this.fetchWithCache(url);
    }

    async getProjectDetails(projectId) {
        const url = `${this.baseURL}/projects/${projectId}`;
        return this.fetchWithCache(url);
    }

    async getUserProjects(username, limit = 20) {
        const url = `${this.baseURL}/users/${username}/projects?limit=${limit}&posted=true&sort_by=updated_at`;
        return this.fetchWithCache(url);
    }

    async getProjectStats(projectId) {
        const url = `${this.baseURL}/projects/${projectId}/stats`;
        return this.fetchWithCache(url);
    }

    // Helper method to extract metadata from projects
    extractProjectMetadata(project) {
        const revision = project.project_revision;
        const site = project.site;
        
        return {
            id: project.project.id,
            title: project.project.title || site?.title || 'Untitled Project',
            description: project.project.description || '',
            creator: project.project.created_by,
            createdAt: new Date(project.project.created_at),
            updatedAt: new Date(project.project.updated_at),
            version: revision?.version || 1,
            revisionCreatedAt: revision ? new Date(revision.created_at) : null,
            siteId: site?.id,
            views: project.views || 0,
            likes: project.likes || 0,
            comments: project.comments || 0,
            remixes: project.remixes || 0,
            isNew: this.isProjectNew(revision),
            thumbnailUrl: project.project.thumbnail?.url,
            videoUrl: project.project.video?.url,
            tags: this.extractTags(project),
            lastActivity: this.getLastActivity(project),
            score: this.calculateScore(project)
        };
    }

    isProjectNew(revision) {
        if (!revision) return false;
        const revisionDate = new Date(revision.created_at);
        const now = new Date();
        const hoursSince = (now - revisionDate) / (1000 * 60 * 60);
        return hoursSince <= 24; // Consider new if within 24 hours
    }

    extractTags(project) {
        const tags = [];
        if (project.project.from_template) tags.push('Template');
        if (project.project.enable_chat) tags.push('Chat');
        if (project.active_players > 0) tags.push('Multiplayer');
        return tags;
    }

    getLastActivity(project) {
        const dates = [
            project.project.updated_at,
            project.project_revision?.created_at
        ].filter(Boolean).map(d => new Date(d));
        
        return dates.length ? new Date(Math.max(...dates)) : new Date(project.project.created_at);
    }

    calculateScore(project) {
        const weights = {
            views: 1,
            likes: 3,
            comments: 2,
            remixes: 5
        };
        
        return (project.views || 0) * weights.views +
               (project.likes || 0) * weights.likes +
               (project.comments || 0) * weights.comments +
               (project.remixes || 0) * weights.remixes;
    }

    clearCache() {
        this.cache.clear();
    }

    // Continuous discovery methods
    async discoverProjectsContinuous() {
        const now = Date.now();
        if (now - this.discoveryState.lastDiscoveryTime < this.discoveryState.rateLimitDelay) {
            return []; // Rate limiting
        }

        this.discoveryState.lastDiscoveryTime = now;

        try {
            // Alternate between different discovery methods
            const discoveryMethod = this.chooseDiccoveryMethod();
            const projects = await this.executeDiscoveryMethod(discoveryMethod);
            
            // Filter out already discovered projects
            const newProjects = projects.filter(p => !this.discoveryState.discoveredProjectIds.has(p.id));
            
            // Track discovered projects
            newProjects.forEach(p => this.discoveryState.discoveredProjectIds.add(p.id));
            this.discoveryState.totalDiscovered += newProjects.length;
            
            console.log(`Discovered ${newProjects.length} new projects (${this.discoveryState.totalDiscovered} total)`);
            return newProjects;
        } catch (error) {
            console.warn('Discovery failed:', error);
            // Increase delay on error
            this.discoveryState.rateLimitDelay = Math.min(this.discoveryState.rateLimitDelay * 1.5, 10000);
            return [];
        }
    }

    chooseDiccoveryMethod() {
        const methods = ['trending', 'search', 'latest', 'following'];
        return methods[Math.floor(Math.random() * methods.length)];
    }

    async executeDiscoveryMethod(method) {
        switch (method) {
            case 'trending':
                return this.discoverFromTrending();
            case 'search':
                return this.discoverFromSearch();
            case 'latest':
                return this.discoverFromLatest();
            case 'following':
                return this.discoverFromFollowing();
            default:
                return this.discoverFromTrending();
        }
    }

    async discoverFromTrending() {
        const response = await this.getRecentProjects(20, this.discoveryState.trendingOffset);
        this.discoveryState.trendingOffset += 20;
        
        // Reset offset occasionally to get fresh trending projects
        if (this.discoveryState.trendingOffset > 500) {
            this.discoveryState.trendingOffset = 0;
        }
        
        return this.extractProjectsFromResponse(response);
    }

    async discoverFromSearch() {
        const searchTerm = this.discoveryState.searchTerms[this.discoveryState.currentSearchIndex];
        this.discoveryState.currentSearchIndex = 
            (this.discoveryState.currentSearchIndex + 1) % this.discoveryState.searchTerms.length;
        
        const response = await this.searchProjects(searchTerm, 15);
        return this.extractProjectsFromResponse(response);
    }

    async discoverFromLatest() {
        const url = `${this.baseURL}/feed/trending?limit=15&feed=newest&range=week`;
        const response = await this.fetchWithCache(url);
        return this.extractProjectsFromResponse(response);
    }

    async discoverFromFollowing() {
        try {
            const url = `${this.baseURL}/feed/posts?sort=latest&limit=10`;
            const response = await this.fetchWithCache(url);
            if (response.data) {
                return response.data.map(item => this.extractProjectMetadata(item.comment))
                    .filter(p => p && p.id);
            }
        } catch (error) {
            console.warn('Following discovery failed:', error);
        }
        return [];
    }

    extractProjectsFromResponse(response) {
        if (response.feed && response.feed.data) {
            return response.feed.data
                .map(item => this.extractProjectMetadata(item))
                .filter(project => project && project.title && project.creator);
        }
        return [];
    }

    getDiscoveryStats() {
        return {
            totalDiscovered: this.discoveryState.totalDiscovered,
            uniqueProjects: this.discoveryState.discoveredProjectIds.size,
            currentOffset: this.discoveryState.trendingOffset,
            rateLimitDelay: this.discoveryState.rateLimitDelay,
            lastDiscoveryTime: this.discoveryState.lastDiscoveryTime
        };
    }

    resetDiscoveryState() {
        this.discoveryState = {
            trendingOffset: 0,
            searchTerms: this.discoveryState.searchTerms,
            currentSearchIndex: 0,
            lastDiscoveryTime: 0,
            rateLimitDelay: 2000,
            discoveredProjectIds: new Set(),
            totalDiscovered: 0
        };
    }
}

export const websimAPI = new WebsimAPI();