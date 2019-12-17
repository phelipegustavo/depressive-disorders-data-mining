const fs = require('fs');
const Country = require('../Models/Country');
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
    }
}