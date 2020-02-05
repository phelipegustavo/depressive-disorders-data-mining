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

 db.getCollection('keywords').aggregate([
    {
        $match: {
            countries: { $eq: ObjectId("5df6a2170975ff383f9af297") }
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
                    cond: { $eq: ["$$country", ObjectId("5df6a2170975ff383f9af297")] }
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
    }
])