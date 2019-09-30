const log = require('../Utils/Logger');

const findOrCreate = async (schema, query, values) => {
    try {
        let data = await schema.findOne(query)
        
        if(!data) {
            data = await schema.create(values)
        }
        
        return data
    } catch (e) {
        log.error({message: 'FindOrCreate', query, error: e.message})
    }
}

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
        log.error({message: 'updateOrCreate', query, error: e.message})
    }
}


module.exports = {
    updateOrCreate,
    findOrCreate,
}