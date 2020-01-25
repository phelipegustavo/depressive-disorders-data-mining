const Publication = require('../Models/Publication');
const Country = require('../Models/Country');
const log = require('../Utils/Logger');
const { updateOrCreate } = require('../Helpers/Criteria');
const { findOrCreateCache } = require('../Helpers/Cache');

module.exports = {

    /**
     * Save publication
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {

        try {
            let { publication } = req.body

            publication = await updateOrCreate(Publication, {pmc: parseInt(publication.pmc)}, publication)
            console.log(publication._id,  ' :: ', publication.country);
            
            res.json({ message: 'SAVE SUCCESSFUL', data: publication });

        } catch (e) {

            console.log('FAIL');
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

        const publications = await Publication.find({ country })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('_id pmc title affiliations')
            .exec()

        res.json(publications)
    }
}