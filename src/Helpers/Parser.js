const camelCase = require('camelcase');
const { xml2json } = require('xml-js');
const fs = require('fs');
const log = require('../Utils/Logger');

const fromFile = (path) => {
    return new Promise((res, rej) => {
        const data = fs.readFileSync(path)
        if(data) {
            const convert = xml2json(data, {compact: true, spaces: 4});
            return res(JSON.parse(convert)['pmc-articleset'].article)
        }
        return rej(false)
    })
}

const getAbstract = (abstract) => {
    try {
        let str = ''
        
        if(abstract._text) {
            str += abstract._text + ' \n '
        } else if (typeof abstract === 'object') {
            const values = Object.values(abstract)
            values.forEach(value => {
                str += getAbstract(value)
            })
        }

        return str
    } catch (e) {
        log.error({message: 'getAbstract', abstract, error: e.message})
    }
}

const getKeywords = (item) => {
    try {
        let keywords = []
        const keys = Object.keys(item)

        if(Array.isArray(item)) {
            item.forEach(kw => {
                keywords = [
                    ...keywords,
                    ...getKeywords(kw)
                ]
            })
        } else {
            if(keys.includes('kwd')) {
                if(item.kwd._text) {
                    keywords = [
                        ...keywords, 
                        item.kwd._text
                    ]
                } else {
                    const kwds = item.kwd.map(({_text}) => _text);
                    keywords = [
                        ...keywords, 
                        ...kwds
                    ]
                }
            }
        }
        return keywords

    } catch (e) {
        log.error({message: 'getKeywords', item, error: e.message})
    }
}

const getTitle = (title) => {
    try {
        str = ''
        if(Array.isArray(title._text)) {
            title._text.forEach(text => {
                str += getTitle(text)
            })
        } else if (title._text) {
            str += title._text
        } else {
            str += title
        }

        return str
    } catch (e) {
        log.error({message: 'getTitle', title, error: e.message})
    }
}

const getIssn = (item) => {
    try {

        if(Array.isArray(item)) {
            return item.reduce((issn, item) => {
                issn = {...issn, ...getIssn(item)}
                return issn
            }, {})
        } else {
            let issn = {};
            const key = camelCase(Object.values(item._attributes)[0])
            issn[key] = item._text
            return issn
        }

    } catch (e) {
        log.error({message: 'getIssn', item, error: e.message})
    }
}

const getAffiliation = (affiliation) => {
    try {

        if(Array.isArray(affiliation)) {
            return affiliation.map(aff => {
                return {
                    id: aff.target && aff.target._attributes 
                        ? aff.target._attributes.id 
                            : aff._attributes 
                                ? aff._attributes.id 
                                    : '',
                    name: aff.institution && aff.institution._text 
                        ? aff._text 
                            : aff['addr-line'] 
                                ? aff['addr-line']._text
                                    : '',
                    country: aff.country ? aff.country._text : ''
                }
            })
        } else {
            return [{
                id: affiliation.target && affiliation.target._attributes 
                    ? affiliation.target._attributes.id 
                        : affiliation._attributes 
                            ? affiliation._attributes.id 
                                : '',
                name: affiliation.institution ? affiliation.institution._text : affiliation._text,
                country: affiliation.country ? affiliation.country._text : ''
            }]
        }

    } catch (e) {
        log.error({message: 'getAffiliation', affiliation, error: e.message})
    }
}

/**
 * Convert Xml String Object to Json CamelCase
 * @param {String} xmlObject 
 */
const getObject = (item) => {
    
    return Object.keys(item).reduce((obj, key) => {
        
        const value = item[key];
        const keyCC = camelCase(key)
        if(!value) return
        
        // keywords
        if(key === 'kwd-group') {
            obj['keywords'] = getKeywords(value)
        } 

        else if (key === 'aff') {
            obj[keyCC] = getAffiliation(value)
        }

        // Title
        else if (key === 'article-title') {
            obj[keyCC] = getTitle(value)
        }

        // ISSN
        else if (key === 'issn') {
            obj['issn'] = getIssn(value)
        }

        // abstract
        else if( key === 'abstract') {
            obj['abstract'] = getAbstract(value)
        }
        
        // array
        else if(Array.isArray(value)) {
            obj[keyCC] = value.map(item => {
                item = getObject(item);
                return item;
            });
        }

        // key attributes
        else if(key === '_attributes') {
            obj = {...obj, ...getObject(value)};

        // key text
        } else if (key === '_text') {
            obj['value'] = value;
        }

        // _text && _attributes
        else if(value._text && value._attributes) {
            obj[keyCC] = getObject(value._attributes)
            obj[keyCC]['value'] = value._text
        }

        // _text 
        else if(value._text) {
            obj[keyCC] = value._text;
        }
        
        // _attributes 
        else if(value._attributes) {
            obj[keyCC] = getObject(value._attributes)        
        }
        
        // string
        else if (typeof value === 'string') {         
            obj[keyCC] = value
        }
        
        // object
        else {            
            obj[keyCC] = getObject(value)
        }

        return obj;
    }, {});
}

module.exports = {
    fromFile,
    getObject,
}