const kue = require('kue');

const Keyword = require('../Models/Keyword');

const log = require('../Utils/Logger');
const { redis } = require('../config');

const Queue = kue.createQueue(redis)

/**
 * ProcessKeywords
 * 
 * @param {Object} data
 * @param {Function} done
 */
Queue.process('ProcessKeywords', async ({data}, done) => {
    
    try {

        let { kwds, country, publicationId } = data;

        if(kwds && country) {
            kwds = await Promise.all(
                kwds.map(async (kwd) => {

                    const name = kwd.toLowerCase();
                    
                    // Invalid keyword
                    if(!name) return;

                    let keyword = await Keyword.findOne({ name }).exec();

                    if(keyword) {

                        if(keyword.publications.includes(publicationId)) {
                            // Already inserted for this publication
                            return;
                        }

                        keyword.publications.push(publicationId)
                        keyword.countries.push(country);

                        return await keyword.save();

                    } else {

                        keyword = {
                            name,
                            countries: [country],
                            publications: [publicationId],
                        }

                        return await Keyword.create(keyword);
                    }
                    
                })
            )
        }
        
        done();
        
    } catch(e) {

        log.error({message: 'KeywordJob.ProcessKeywords', error: e.message})
        done(e);
    } 

})

Queue.setMaxListeners(1000)

module.exports = Queue;
