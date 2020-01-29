const Keyword = require('../Models/Keyword');
const Country = require('../Models/Country');

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
        const keyword = await Keyword.findOne({_id: id}).exec()


        distinctCountries = [...new Set(keyword.countries)];

        const countries = await Promise.all(
            distinctCountries.map(async(_id) => {
                
                const country = await Country.findOne({ _id });
                const pubs = await Publication.find({ country: _id }).count();
                const countrykwds = keyword.countries.filter(c => c === _id).length;

                return {
                    _id: country._id,
                    name: country.name,
                    code: country.code.toLowerCase(),
                    relative: countrykwds/pubs,
                    percentage: countrykwds/keyword.countries.length
                }

            })
        );

        return res.json(countries)
    }
}