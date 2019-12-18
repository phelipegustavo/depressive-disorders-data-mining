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
            
            countries = await findOrCreateCache('countries_list', Country.find({}))
            
            const country = countries.find(({regex}) => new RegExp(regex, 'i').test(publication.country.trim()))
            if(!country) {
                log.error({ message: `COUNTRY NOT FOUND ${publication.country}`, pmc: publication.pmc, req: req.body })
                publication.country = null
            } else {
                publication.country = country._id
            }

            publication = await updateOrCreate(Publication, {pmc: parseInt(publication.pmc)}, publication)

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
            { 
                $group: { 
                    _id: "$country", 
                    count: { $sum: 1 },
                } 
            } 
        ]).exec()

        const items = await Promise.all(
            countries.map(async ({_id, count}) => {
                const country = await Country.findOne({_id})
                if(country) {
                    return {
                        name: country.name,
                        lat: country.lat,
                        lng: country.lng,
                        count,
                    }
                }
            }).filter(id => id !== null)
        )

        res.json(items)
    }
}