module.exports = {
    
    port: process.env.PORT || 5555,
    host: process.env.HOST || 'localhost',
    
    mongo: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        user: process.env.MONGO_USER || 'admin',
        password: process.env.MONGO_PASSWORD || 'admin',
        database: process.env.MONDO_DATABASE || 'data-mining',
    },

    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        auth: process.env.REDIS_PASS || '',
        options: {
          no_ready_check: false
        }
    },

    repository: 'https://eutils.ncbi.nlm.nih.gov/entrez',
}