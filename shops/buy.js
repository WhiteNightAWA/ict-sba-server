const Items = require("../models/items");
const User = require("../models/user");
const {ObjectId} = require("mongodb");

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert degrees to radians
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    // Calculate the differences in latitude and longitude
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    // Apply the Haversine formula
    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(deltaLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;

    return distance;
}

// Example usage
const distance = calculateDistance(52.520008, 13.404954, 48.858844, 2.294350);
console.log(distance); // Output: 878.656 km


const search = async (req, res) => {
    try {
        let {name, selectedCategory, noSave, sortBy, un, favorited, page, position} = req.query;
        console.log(req.query);
        if (sortBy === "distance") {
            position = JSON.parse(position);
        }
        selectedCategory = JSON.parse(selectedCategory);
        let user = await User.findOne({ user_id: favorited }, { favorited: 1 });
        if (user) {
            favorited = user.favorited.map((f, index) => {
                try {
                    return new ObjectId(f);
                } catch (err) {
                    return ""
                }
            });
        } else {
            favorited = []
        }

        un = un === "true";
        noSave = noSave === "true";
        let results = await Items.aggregate([
            { $match: {
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
                    _id: favorited?.length > 0 ? {$in: favorited} : {$exists: true},
                    deleted: false,
                    visible: true,
                    record: noSave ? {$exists: true} : {$exists: true, $not: {$size: 0}}
                } },
            { $lookup: {
                    from: "shops",
                    localField: "shopId",
                    foreignField: "_id",
                    as: "shop",
                }, },
            { $unwind: "$shop" },
            { $addFields: {
                    cheapest: {
                        $min: {
                            $map: {
                                input: "$price",
                                as: 'p',
                                in: {$divide: [{$arrayElemAt: ['$$p', 0]}, {$arrayElemAt: ['$$p', 1]}]}
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
                    shopData: {
                        shopName: "$shop.shopName",
                        avatar: "$shop.avatar",
                        short: "$shop.short",
                    },
                    distance: {
                        $let: {
                            vars: {
                                lat1: {$arrayElemAt: ["$shop.position", 0]},
                                lon1: {$arrayElemAt: ["$shop.position", 1]},
                                lat2: sortBy === "distance" ? position[0] : 0,
                                lon2: sortBy === "distance" ? position[1] : 0,
                            },
                            in: {
                                $multiply:  [
                                    6371,
                                    2,
                                    {
                                        $asin: {
                                            $sqrt: {
                                                $add: [
                                                    {
                                                        $pow: [
                                                            {
                                                                $sin: {
                                                                    $divide: [
                                                                        { $multiply: [{ $subtract: ["$$lat2", "$$lat1"] }, Math.PI, 1 / 180, 0.5] },
                                                                        1
                                                                    ]
                                                                }
                                                            },
                                                            2
                                                        ]
                                                    },
                                                    {
                                                        $multiply: [
                                                            {
                                                                $cos: { $divide: [{ $multiply: ["$$lat1", Math.PI, 1 / 180] }, 1] }
                                                            },
                                                            {
                                                                $cos: { $divide: [{ $multiply: ["$$lat2", Math.PI, 1 / 180] }, 1] }
                                                            },
                                                            {
                                                                $pow: [
                                                                    {
                                                                        $sin: { $divide: [{ $multiply: [{ $subtract: ["$$lon2", "$$lon1"] }, Math.PI, 1 / 180, 0.5] }, 1] }
                                                                    },
                                                                    2
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            },
                        },
                    },
                }, },
                {
                    $project: {
                        shop: 0,
                    },
                },
                {
                    $sort: sortBy === "price" ?
                        { "cheapest": un ? -1 : 1 } : sortBy === "fresh" ?
                        { "fresh": un ? 1 : -1 } : sortBy === "distance" ?
                        { "distance": un ? -1 : 1 } :
                        { "name": un ? -1 : 1 },
                },
                { $facet: { count: [ {"$count": "value"} ], paginatedResults: [ {"$skip": page * 5}, {"$limit": 5} ] } }
        ])
        ;
        return res.status(200).json({
            code: 200,
            success: "search_successfully",
            msg: "Search Successfully!",
            items: results[0].paginatedResults,
            count: results[0].count.length > 0 ? results[0].count[0].value : 0,
        })
    } catch
        (err) {
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
