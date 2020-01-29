// Count publications by country
db
.getCollection('publications')
.aggregate([
     { $project: { aff: { $arrayElemAt: ['$affiliation', 0] } } },
     { $match: { 'aff.country': /.*Brazil.*/ } },
     { $group: { _id: null, count: {$sum: 1} } }
])

// Select keywords by country
db.getCollection('keywords').find({
     countries: { 
         $elemMatch: { $eq: ObjectId("5df6a2170975ff383f9af2b1") } 
     }
 }).sort({ count: -1 })