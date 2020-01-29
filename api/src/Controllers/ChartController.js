const Publication = require('../Models/Publication');
const Country = require('../Models/Country');

module.exports = {

    /**
     * List chart data
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async list(req, res) {

        try {
            // All publications 
            const total = await Publication.find({}).count();
            // Identified country 
            const identifiedCountry = await Publication.find({country: { $ne: null }}).count();       
            
            // Publications countries
            const publications = await Publication.aggregate([
                { $match: { country: { $ne: null } } },
                { $group: { _id: "$country", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]).exec()
            const countries = await Promise.all(
                publications.map(async ({_id, count}) => {
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
                })
            )

            res.json({
                total,
                identifiedCountry,
                countries,
            });

        } catch (e) {

            res.json({ message: 'FAILURE', error: e.message })
        }
    },
}