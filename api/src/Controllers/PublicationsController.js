const Publication = require('../Models/Publication');
const Country = require('../Models/Country');
const KeywordJob = require('../Jobs/KeywordJob');

const log = require('../Utils/Logger');
const { updateOrCreate } = require('../Helpers/Criteria');
module.exports = {

    /**
     * Save publication
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {

        try {
            let { publication } = req.body;

            const { kwds } = publication;

            publication = await updateOrCreate(Publication, {pmc: parseInt(publication.pmc)}, publication)

            const job = KeywordJob
                .create('ProcessKeywords', {
                    kwds,
                    country: publication.country,
                    publicationId: publication._id, 
                })
                .priority('high')
                .delay(100)
                .attempts(5)
                .save()

            job.once('start', (e) => {
                log.success({ message: 'JOB START', pmc: publication.pmc });
            })
            job.on('failed', (e) => {
                log.error({ message: 'JOB FAILED', pmc: publication.pmc, err: e })
            })
            job.on('complete', (e) => {
                log.success({ message: 'JOB COMPLETE', pmc: publication.pmc })
            })
            
            res.json({ message: 'SAVE SUCCESSFUL', data: publication });

        } catch (e) {

            log.error({ message: 'FAIL TO SAVE PUBLICATION', error: e.message, req: req.body})
            res.json({ message: 'SAVE FAILURE', error: e.message })
        }
    },

    /**
     * List countries with publications count
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async list(req, res) {

        const countries = await Publication.aggregate([
            { $match: { country: { $ne: null } } },
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]).exec()

        const total = await Publication.find({ country: { $ne: null } }).count();
        const items = await Promise.all(
            countries.map(async ({_id, count}) => {
                const country = await Country.findOne({_id})
                if(country) {
                    return {
                        _id: country._id,
                        name: country.name,
                        lat: country.lat,
                        lng: country.lng,
                        code: country.code.toLowerCase(),
                        count,
                        percentage: (count/total*100).toFixed(2),
                    }
                }
            }).filter(id => id !== null)
        )

        res.json(items)
    },

    /**
     * List publications by country id
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async publications(req, res) {

        const { country } = req.params;
        let { page, perPage, search } = req.query;

        page = page ? Number(page) : 1;
        perPage = perPage ? Number(perPage) : 10;
        search = search ? search : '';

        const exp = new RegExp(`.*${search}.*`, 'gi');
        const publications = await Publication.find({ 
            country, 
            title: exp
        })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('_id pmc title affiliations')
            .exec()

        res.json(publications)
    }
}