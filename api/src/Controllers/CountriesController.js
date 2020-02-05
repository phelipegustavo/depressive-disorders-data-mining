const Country = require('../Models/Country');
const Keyword = require('../Models/Keyword');
const { Types } = require('mongoose');
const { findOrCreate } = require('../Helpers/Criteria');
const { readFile } = require('../Helpers/File');

module.exports = {

    /**
     * Save Countries
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async save(req, res) {

        const reg =  JSON.parse(await readFile(__dirname + '/../Utils/data/regex.json'))
        const countries =  JSON.parse(await readFile(__dirname + '/../Utils/data/countries.json'))

        await countries.map(async item => {

            const finded = reg.find(regx => regx['ISO2'] === item.code)
            if (finded) {
                return await findOrCreate(Country, {code: item.code}, {
                    regex: finded.regex,
                    name: item.longname,
                    name_variations: {
                        ar: item.name_ar,
                        cs: item.name_cs,
                        cy: item.name_cy,
                        da: item.name_da,
                        de: item.name_de,
                        en: item.name_en,
                        es: item.name_es,
                        fr: item.name_fr,
                        he: item.name_he,
                        it: item.name_it,
                        ja: item.name_ja,
                        nl: item.name_nl,
                        pt: item.name_pt,
                        ru: item.name_ru,
                        sk: item.name_sk,
                        zn_cn: item.name_zn_cn,
                        zh_hk: item.name_zh_hk,
                    },
                    lat: item.latitude,
                    lng: item.longitude,
                    ...item,
                })
            }
        });

        res.json({message: 'ok'});
    },

    /**
     * List all countries
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async list(req, res) {
        try {

            countries = await Country.find().select('_id name regex code');

            res.json({message: 'ok', countries})
            
        } catch (error) {
            console.log(error)
            res.json({error})
        }
    },

    /**
     * List Keywords By Country
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async keywords(req, res) {

        const { country } = req.params;
        let { page, perPage, search } = req.query;

        page = page ? Number(page) : 1;
        perPage = perPage ? Number(perPage) : 10;
        search = search ? search : '';

        const keywords = await Keyword.aggregate([
            {
                $match: {
                    countries: { $eq: Types.ObjectId(country) }
                }
            },
            { 
                $project: {
                    _id: "$_id",
                    name: "$name",
                    countries: {
                        $filter: {
                            input: "$countries",
                            as: "country",
                            cond: { $eq: ["$$country", Types.ObjectId(country)] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$_id",
                    name: "$name",
                    country: { $arrayElemAt: ["$countries", 0] },
                    total: { $size: "$countries" }
                }
            },
            {
                $sort : { total : -1 }
            },
            {
                $limit: 5,
            }
        ]).exec();

        res.json(keywords)
    }
}