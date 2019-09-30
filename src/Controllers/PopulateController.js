const Queue = require('../Jobs/Populate');
const log = require('../Utils/Logger');

module.exports = {

    async process(req, res) {
        
        const term = 'depressive';
        const { id } = req.body;
        
        if(!id) {
            res.json({ err: 'id required' })
        }

        const job = Queue
            .create('StartProcess', {term, id: id})
            .priority('high')
            .delay(100)
            .attempts(5)
            .save()

        res.json({ message: 'OK' });
        
        job.once('start', (e) => {
            log.success({ message: 'JOB START', id });
        })
        job.on('failed', (e) => {
            log.error({ message: 'JOB FAILED', id, err: e })
        })
        job.on('complete', (e) => {
            log.success({ message: 'JOB COMPLETE', id })
        })
    }
}