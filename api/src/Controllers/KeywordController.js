const Keyword = require('../Models/Keyword');
const Country = require('../Models/Country');
const Publication = require('../Models/Publication');

module.exports = {

    /**
     * List Keywords
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async list(req, res) {
        
        let { page, perPage, search } = req.query;

        page = page ? Number(page) : 1;
        perPage = perPage ? Number(perPage) : 10;
        search = search ? search : '';

        const exp = new RegExp(`.*${search}.*`, 'gi');
        const keywords = await Keyword.find({
            name: exp,
        })
            .sort({ count: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('_id name count')
            .exec()

        return res.json(keywords)
    },

    /**
     * List Keyword Countries 
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async countries(req, res) {

        const { id } = req.params;
        const keyword = await Keyword.findOne({_id: id}).exec();
        let countries = keyword.countries.map(id => id.toString());

        distinctCountries = [...new Set(countries)];
        

        countries = await Promise.all(
            distinctCountries.map(async(_id) => {
                const country = await Country.findById(_id);
                const pubs = await Publication.find({ country: _id }).count();
                const countrykwds = countries.filter(id => id === _id).length;
                return {
                    _id: country._id,
                    name: country.name,
                    code: country.code.toLowerCase(),
                    relative: (countrykwds/pubs * 100).toFixed(2),
                    percentage: (countrykwds/keyword.countries.length * 100).toFixed(2),
                    total: countrykwds,
                }

            })
        );

        countries = countries.sort((a,b) => a.relative < b.relative)

        return res.json({
            countries: JSON.stringify(countries)
        });
    }
}