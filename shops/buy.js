const Items = require("../models/items");
const {ObjectId} = require("mongodb");


const search = async (req, res) => {
    try {
        let {name, selectedCategory, noSave, sortBy, un, favorited, page} = req.query;
        console.log(req.query);
        selectedCategory = JSON.parse(selectedCategory);
        favorited = JSON.parse(favorited).map((f, index) => {
            try {
                return new ObjectId(f);
            } catch (err) {
                return ""
            }
        });
        un = un === "true";
        noSave = noSave === "true";
        console.log(favorited);
        let results = await Items.aggregate([
            { "$match": {
                    $and: [
                        {   // name
                            $or: [
                                {name: {$regex: name ? new RegExp(name, "i") : ""}},
                                {desc: {$regex: name ? new RegExp(name, "i") : ""}},
                                {selectedCategoryOther: {$regex: name ? new RegExp(name, "i") : ""}},
                                {selectedCategory: {$elemMatch: {$regex: name ? new RegExp(name, "i") : ""}}},
                            ]
                        },
                        selectedCategory?.length > 0 ? {
                            $or: selectedCategory.map(v => ({selectedCategory: {$regex: v}}))
                        } : {},
                    ],
                    _id: favorited?.length > 0 ? { $in: favorited } : { $exists: true },
                    deleted: false,
                    visible: true,
                    record: noSave ? { $exists: true } : { $exists: true, $not: { $size: 0 } }
                } },
            { "$addFields": {
                cheapest: {
                    $min: {
                        $map: {
                            input: "$price",
                            as: 'p',
                            in: {$divide: [ {$arrayElemAt: ['$$p', 0]}, {$arrayElemAt: ['$$p', 1]} ]}
                        }
                    }
                },
                fresh: {
                    $max: {
                        $map: {
                            input: "$record",
                            as: "r",
                            in: "$$r.time"
                        }
                    }
                },
            } },
            {"$sort": sortBy==="price" ? {"cheapest": un ? -1 : 1} : sortBy==="fresh" ? { "fresh": un ? 1 : -1 } : {"name": un ? -1 : 1}},
            { "$facet": {
                    count: [
                        { "$count": "value" }
                    ],
                    paginatedResults: [
                        { "$skip": page * 5 },
                        { "$limit": 5 }
                    ]
                }
            }
        ]);
        return res.status(200).json({
            code: 200,
            success: "search_successfully",
            msg: "Search Successfully!",
            items: results[0].paginatedResults,
            count: results[0].count.length > 0 ? results[0].count[0].value : 0,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "server_error",
            error_description: err.toString(),
            error_json: err,
            code: 500,
        });
    }
}


module.exports = {
    search,
};
