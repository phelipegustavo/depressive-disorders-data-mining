const Log = require('../Models/Log');
const log = require('../Utils/Logger');

module.exports = {

    /**
     * Save log
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {

        try {
            let { data, type, message } = req.body

            model = await Log.create({ data, type, message })
            
            res.json({ message: 'SAVE SUCCESSFUL', data: model });

        } catch (e) {

            log.error({ message: 'FAIL TO SAVE LOG', error: e.message, req: req.body})
            res.json({ message: 'SAVE FAILURE', error: e.message })
        }
    },
}