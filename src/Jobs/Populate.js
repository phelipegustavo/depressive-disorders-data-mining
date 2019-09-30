const kue = require('kue');

const log = require('../Utils/Logger');
const { redis } = require('../config');

const Queue = kue.createQueue(redis)

Queue.process('StartProcess', async (data, done) => {
    
    try {
        //
        done()
        
    } catch(e) {
        log.error({message: 'StartProcess', error: e.message})
        done(e);
    } 

})

Queue.setMaxListeners(1000)

module.exports = Queue;
