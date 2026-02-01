/**
 * DataLoader - Handles hybrid data management
 * Loads prompt libraries from online sources with offline fallback
 */

class DataLoader {
    constructor() {
        // Online library index URLs
        this.INDEX_URLS = {
            zh: 'https://gist.githubusercontent.com/weihua-studio/051d3a6a6a50ef1690166b9502212c5e/raw/1562b13f01211aba547b6c2f503676f2cf1ea6b1/library_index.json',
            en: 'https://gist.githubusercontent.com/weihua-studio/07ca630b76a6e93f26367df8112c248f/raw/2434214848fc1dab76fdc36e0d7e143355acdc0c/library_index_GlobalWorld.json'
        };

        // Fallback libraries (bundled)
        this.FALLBACK_LIBRARIES = {
            '⚠️ Offline Backup': 'https://gist.githubusercontent.com/weihua-wang/raw/prompts.json'
        };

        this.cache = {
            libraries: {},
            libraryData: {}
        };
    }

    /**
     * Load master index of libraries
     * @param {string} lang - Language code ('zh' or 'en')
     * @returns {Promise<Object>} Library index
     */
    async loadMasterIndex(lang = 'zh') {
        const cacheKey = `index_${lang}`;
        
        // Try to load from cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }

        // Try online source
        try {
            const url = this.INDEX_URLS[lang] || this.INDEX_URLS.zh;
            const response = await fetch(`${url}?t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-cache',
                timeout: 5000
            });

            if (response.ok) {
                const data = await response.json();
                this.saveToCache(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.warn('Failed to load online index:', error);
        }

        // Fallback to offline libraries
        console.log('Using fallback libraries');
        return this.FALLBACK_LIBRARIES;
    }

    /**
     * Load a specific library's data
     * @param {string} url - Library data URL
     * @returns {Promise<Object>} Library data
     */
    async loadLibrary(url) {
        const cacheKey = `library_${url}`;

        // Try cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }

        // Try online source
        try {
            const response = await fetch(`${url}?t=${Date.now()}`, {
                method: 'GET',
                cache: 'no-cache',
                timeout: 5000
            });

            if (response.ok) {
                const data = await response.json();
                this.saveToCache(cacheKey, data);
                return data;
            }
        } catch (error) {
            console.error('Failed to load library:', error);
            throw new Error('Failed to load library data');
        }
    }

    /**
     * Get data from localStorage cache
     * @param {string} key - Cache key
     * @returns {Object|null} Cached data or null
     */
    getFromCache(key) {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                // Cache valid for 24 hours
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    return data;
                }
            }
        } catch (error) {
            console.warn('Cache read error:', error);
        }
        return null;
    }

    /**
     * Save data to localStorage cache
     * @param {string} key - Cache key
     * @param {Object} data - Data to cache
     */
    saveToCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Cache write error:', error);
        }
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('index_') || key.startsWith('library_')) {
                    localStorage.removeItem(key);
                }
            });
            console.log('Cache cleared');
        } catch (error) {
            console.warn('Cache clear error:', error);
        }
    }

    /**
     * Check if online
     * @returns {boolean} Online status
     */
    isOnline() {
        return navigator.onLine;
    }
}

// Export for use in other scripts
window.DataLoader = DataLoader;
