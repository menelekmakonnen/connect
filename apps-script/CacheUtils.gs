/**
 * Cache Utility for Google Apps Script
 * Wraps CacheService to handle JSON parsing and consistent keys.
 */
var CacheUtils = (function() {
  var CACHE = CacheService.getScriptCache();
  var DEFAULT_DURATION = 600; // 10 minutes

  // Prefix keys to avoid collisions
  var PREFIX = 'ICUNI_V1_';

  return {
    /**
     * Get item from cache
     */
    get: function(key) {
      try {
        var cached = CACHE.get(PREFIX + key);
        if (!cached) return null;
        return JSON.parse(cached);
      } catch (e) {
        Logger.log('Cache get error for ' + key + ': ' + e);
        return null;
      }
    },

    /**
     * Set item in cache
     */
    set: function(key, value, duration) {
      try {
        var str = JSON.stringify(value);
        // Check size limit (100KB is approx 100,000 chars)
        if (str.length > 95000) {
          Logger.log('Cache item too large for ' + key + ' (' + str.length + ' chars)');
          return;
        }
        CACHE.put(PREFIX + key, str, duration || DEFAULT_DURATION);
      } catch (e) {
        Logger.log('Cache set error for ' + key + ': ' + e);
      }
    },

    /**
     * Remove item from cache
     */
    remove: function(key) {
        try {
            CACHE.remove(PREFIX + key);
        } catch (e) {
            Logger.log('Cache remove error for ' + key + ': ' + e);
        }
    },

    /**
     * Get from cache or execute callback and set
     */
    getOrSet: function(key, callback, duration) {
      var cached = this.get(key);
      if (cached) {
        // Logger.log('Cache hit for ' + key);
        return cached;
      }

      // Logger.log('Cache miss for ' + key);
      var data = callback();
      if (data) {
        this.set(key, data, duration);
      }
      return data;
    }
  };
})();
