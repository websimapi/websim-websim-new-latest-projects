export class ProjectLeaderboard {
    constructor() {
        this.projects = new Map();
        this.sortedProjects = [];
        this.lastUpdated = null;
        this.storageKey = 'websim_project_leaderboard';
        this.discoveryStats = {
            isDiscovering: false,
            discoveryStarted: null,
            totalSessionDiscovered: 0,
            sessionsDiscovered: 0
        };
        this.loadFromStorage();
    }

    // Add or update a project in the leaderboard
    indexProject(projectMetadata) {
        const existingProject = this.projects.get(projectMetadata.id);
        
        // Check if project needs updating
        if (this.shouldUpdateProject(existingProject, projectMetadata)) {
            this.projects.set(projectMetadata.id, {
                ...projectMetadata,
                indexedAt: new Date(),
                lastSeen: new Date()
            });
            
            console.log(`Indexed project: ${projectMetadata.title}`);
            this.invalidateSort();
            this.saveToStorage();
            return true;
        }
        
        // Update last seen time for existing projects
        if (existingProject) {
            existingProject.lastSeen = new Date();
        }
        
        return false;
    }

    // Check if project should be updated in leaderboard
    shouldUpdateProject(existingProject, newMetadata) {
        if (!existingProject) return true;
        
        return (
            existingProject.version < newMetadata.version ||
            existingProject.views < newMetadata.views ||
            existingProject.likes < newMetadata.likes ||
            existingProject.comments < newMetadata.comments ||
            existingProject.updatedAt < newMetadata.updatedAt
        );
    }

    // Bulk index multiple projects
    indexProjects(projectsArray) {
        let updatedCount = 0;
        
        projectsArray.forEach(project => {
            if (this.indexProject(project)) {
                updatedCount++;
            }
        });
        
        console.log(`Indexed ${updatedCount} new/updated projects`);
        return updatedCount;
    }

    // Get sorted projects with various sorting options
    getSortedProjects(sortBy = 'newest', limit = null, filters = {}) {
        if (!this.sortedProjects.length || this.needsReSort(sortBy)) {
            this.sortProjects(sortBy);
        }
        
        let filtered = this.sortedProjects;
        
        // Apply filters
        if (filters.isNew) {
            filtered = filtered.filter(p => p.isNew);
        }
        
        if (filters.minViews) {
            filtered = filtered.filter(p => p.views >= filters.minViews);
        }
        
        if (filters.hasVideo) {
            filtered = filtered.filter(p => p.videoUrl);
        }
        
        if (filters.creator) {
            filtered = filtered.filter(p => 
                p.creator.username.toLowerCase().includes(filters.creator.toLowerCase())
            );
        }
        
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(p => 
                filters.tags.some(tag => p.tags.includes(tag))
            );
        }
        
        return limit ? filtered.slice(0, limit) : filtered;
    }

    // Sort projects by different criteria
    sortProjects(sortBy) {
        this.sortedProjects = Array.from(this.projects.values());
        
        switch (sortBy) {
            case 'newest':
                this.sortedProjects.sort((a, b) => b.lastActivity - a.lastActivity);
                break;
            case 'oldest':
                this.sortedProjects.sort((a, b) => a.createdAt - b.createdAt);
                break;
            case 'mostViewed':
                this.sortedProjects.sort((a, b) => b.views - a.views);
                break;
            case 'mostLiked':
                this.sortedProjects.sort((a, b) => b.likes - a.likes);
                break;
            case 'mostCommented':
                this.sortedProjects.sort((a, b) => b.comments - a.comments);
                break;
            case 'mostRemixed':
                this.sortedProjects.sort((a, b) => b.remixes - a.remixes);
                break;
            case 'score':
                this.sortedProjects.sort((a, b) => b.score - a.score);
                break;
            case 'alphabetical':
                this.sortedProjects.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                this.sortedProjects.sort((a, b) => b.lastActivity - a.lastActivity);
        }
        
        this.lastSortBy = sortBy;
        this.lastUpdated = new Date();
    }

    // Get leaderboard statistics
    getStats() {
        const projects = Array.from(this.projects.values());
        const now = new Date();
        
        return {
            totalProjects: projects.length,
            newProjects: projects.filter(p => p.isNew).length,
            totalViews: projects.reduce((sum, p) => sum + p.views, 0),
            totalLikes: projects.reduce((sum, p) => sum + p.likes, 0),
            averageScore: projects.reduce((sum, p) => sum + p.score, 0) / projects.length || 0,
            lastUpdated: this.lastUpdated,
            recentlyIndexed: projects.filter(p => 
                now - new Date(p.indexedAt) < 60 * 60 * 1000 // within 1 hour
            ).length,
            discovery: this.getDiscoveryStats()
        };
    }

    // Find projects similar to a given project
    findSimilarProjects(projectId, limit = 5) {
        const targetProject = this.projects.get(projectId);
        if (!targetProject) return [];
        
        const scored = Array.from(this.projects.values())
            .filter(p => p.id !== projectId)
            .map(p => ({
                project: p,
                similarity: this.calculateSimilarity(targetProject, p)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
        
        return scored.map(s => s.project);
    }

    // Calculate similarity between two projects
    calculateSimilarity(project1, project2) {
        let score = 0;
        
        // Same creator
        if (project1.creator.id === project2.creator.id) score += 50;
        
        // Similar view count range
        const viewRatio = Math.min(project1.views, project2.views) / Math.max(project1.views, project2.views, 1);
        score += viewRatio * 20;
        
        // Common tags
        const commonTags = project1.tags.filter(tag => project2.tags.includes(tag));
        score += commonTags.length * 10;
        
        // Similar creation time
        const timeDiff = Math.abs(project1.createdAt - project2.createdAt) / (1000 * 60 * 60 * 24); // days
        score += Math.max(0, 20 - timeDiff); // closer in time = higher score
        
        return score;
    }

    // Compare projects metadata and detect changes
    compareProjects(project1, project2) {
        const changes = {};
        
        if (project1.views !== project2.views) {
            changes.views = { from: project1.views, to: project2.views };
        }
        
        if (project1.likes !== project2.likes) {
            changes.likes = { from: project1.likes, to: project2.likes };
        }
        
        if (project1.comments !== project2.comments) {
            changes.comments = { from: project1.comments, to: project2.comments };
        }
        
        if (project1.version !== project2.version) {
            changes.version = { from: project1.version, to: project2.version };
        }
        
        return changes;
    }

    // Utility methods
    needsReSort(sortBy) {
        return !this.lastSortBy || this.lastSortBy !== sortBy || !this.lastUpdated ||
               (new Date() - this.lastUpdated) > 5 * 60 * 1000; // 5 minutes
    }

    invalidateSort() {
        this.sortedProjects = [];
        this.lastSortBy = null;
    }

    // Persistence methods
    saveToStorage() {
        try {
            const data = {
                projects: Array.from(this.projects.entries()),
                lastUpdated: this.lastUpdated
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save leaderboard to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.projects = new Map(data.projects);
                this.lastUpdated = data.lastUpdated ? new Date(data.lastUpdated) : null;
                
                // Convert stored date strings back to Date objects
                this.projects.forEach(project => {
                    project.createdAt = new Date(project.createdAt);
                    project.updatedAt = new Date(project.updatedAt);
                    project.lastActivity = new Date(project.lastActivity);
                    if (project.revisionCreatedAt) {
                        project.revisionCreatedAt = new Date(project.revisionCreatedAt);
                    }
                    if (project.indexedAt) {
                        project.indexedAt = new Date(project.indexedAt);
                    }
                    if (project.lastSeen) {
                        project.lastSeen = new Date(project.lastSeen);
                    }
                });
                
                console.log(`Loaded ${this.projects.size} projects from storage`);
            }
        } catch (error) {
            console.warn('Failed to load leaderboard from storage:', error);
        }
    }

    clearStorage() {
        localStorage.removeItem(this.storageKey);
        this.projects.clear();
        this.sortedProjects = [];
        this.lastUpdated = null;
    }

    // Start continuous discovery
    startContinuousDiscovery(websimAPI) {
        if (this.discoveryStats.isDiscovering) return;
        
        this.discoveryStats.isDiscovering = true;
        this.discoveryStats.discoveryStarted = new Date();
        this.discoveryStats.sessionsDiscovered = 0;
        
        console.log('Starting continuous project discovery...');
        
        const discoveryLoop = async () => {
            if (!this.discoveryStats.isDiscovering) return;
            
            try {
                const newProjects = await websimAPI.discoverProjectsContinuous();
                if (newProjects.length > 0) {
                    const indexed = this.indexProjects(newProjects);
                    this.discoveryStats.totalSessionDiscovered += indexed;
                    this.discoveryStats.sessionsDiscovered++;
                }
                
                // Continue discovery with random interval between 3-8 seconds
                const nextDelay = 3000 + Math.random() * 5000;
                setTimeout(discoveryLoop, nextDelay);
            } catch (error) {
                console.warn('Discovery loop error:', error);
                // Retry with longer delay on error
                setTimeout(discoveryLoop, 10000);
            }
        };
        
        // Start with a small delay
        setTimeout(discoveryLoop, 1000);
    }

    stopContinuousDiscovery() {
        this.discoveryStats.isDiscovering = false;
        console.log('Stopped continuous project discovery');
    }

    getDiscoveryStats() {
        return {
            ...this.discoveryStats,
            totalProjects: this.projects.size,
            discoveryDuration: this.discoveryStats.discoveryStarted ? 
                Date.now() - this.discoveryStats.discoveryStarted : 0
        };
    }
}

export const leaderboard = new ProjectLeaderboard();