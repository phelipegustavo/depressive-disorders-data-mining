const log = require('../Utils/Logger');

/**
 * Find or create model
 * 
 * @param {Object} schema 
 * @param {Object} query 
 * @param {Object} values 
 * @returns {Object} 
 */
const findOrCreate = async (schema, query, values) => {
    try {
        let data = await schema.findOne(query)
        
        if(!data) {
            data = await schema.create(values)
        }
        
        return data
    } catch (e) {
        log.error({message: 'CRITERIA.findOrCreate', error: e.message, query})
    }
}

/**
 * Update or create model
 * 
 * @param {Object} schema 
 * @param {Object} query 
 * @param {Object} values
 * @returns {Object} 
 */
const updateOrCreate = async (schema, query, values) => {
    try {
     
        let data = await schema.findOne(query)
        
        if(data) {
            data = await schema.updateOne({ _id: data._id }, { $set : values })
        } else {
            data = await schema.create(values)
        }
        
        return data
    } catch (e) {
        log.error({message: 'CRITERIA.updateOrCreate', error: e.message, query})
    }
}


module.exports = {
    updateOrCreate,
    findOrCreate,
}