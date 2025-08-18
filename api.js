export class WebsimAPI {
    constructor() {
        this.baseURL = '/api/v1';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
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
}

export const websimAPI = new WebsimAPI();

