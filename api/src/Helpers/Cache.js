const redis = require('redis');
const config = require('../config');

/**
 * Find or create some cache by key
 * 
 * @param {String} key 
 * @param {Function} cb 
 * @param {Number} time 
 * @returns {Object}
 */
const findOrCreateCache = async (key, cb, time=60*60*24) => {

    try {
        const client = redis.createClient(config.redis.port)            
        const cached = await client.get(key);
    
        if (!cached) {
            data = await cb
            client.setex(key, time, JSON.stringify(data));
        } else {
            data = JSON.parse(cached)
        }
        
        client.quit();
    
        return data
    } catch (e) {
        console.log(e)
    }    
}


module.exports = {
    findOrCreateCache,
}
