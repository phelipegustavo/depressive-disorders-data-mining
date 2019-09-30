const redis = require('redis');
const config = require('../config');

    
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
    
        return data
    } catch (e) {
        console.log(e)
    }    
}


module.exports = {
    findOrCreateCache,
}
