// Count publications by country
db
.getCollection('publications')
.aggregate([
     { $project: { aff: { $arrayElemAt: ['$affiliation', 0] } } },
     { $match: { 'aff.country': /.*Brazil.*/ } },
     { $group: { _id: null, count: {$sum: 1} } }
])