const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {ObjectId} = require("mongodb");


const marked = async (req, res) => {
    try {
        let {itemId} = req.params;
        if ([itemId].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { itemId }.",
                code: 400,
            });
        }

        let {action} = req.body;
        if ([action].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { action }.",
                code: 400,
            });
        }

        try {
            itemId = new ObjectId(itemId);
        } catch (err) {
            return res.status(400).json({
                error: "invalid_itemId",
                error_description: "Invalid Item.",
                err: err.toString(),
                code: 400,
            });
        }

        let item = await Items.findOne({_id: itemId});
        let user = await User.findOne({user_id: req.user_id});
        if (!item || !user) {
            return res.status(400).json({
                error: "invalid_itemId_or_user",
                error_description: "Invalid Item or User.",
                err: err.toString(),
                code: 400,
            });
        }

        switch (action) {
            case "favorite":
                user = await User.findOneAndUpdate({user_id: req.user_id}, {
                    favorited: user.favorited.includes(itemId.toString()) ? user.favorited : [...user.favorited, itemId.toString()]
                });
                return res.status(200).json({
                    code: 200,
                    success: "favorited_successfully",
                    msg: "Favorited Successfully!",
                    favorited: user.favorited.includes(itemId.toString()) ? user.favorited : [...user.favorited, itemId.toString()]
                })
            case "unfavorite":
                user = await User.findOneAndUpdate({user_id: req.user_id}, {
                    favorited: user.favorited.includes(itemId.toString()) ? user.favorited.filter(f => f !== itemId.toString()) : user.favorited
                });
                return res.status(200).json({
                    code: 200,
                    success: "unfavorited_successfully",
                    msg: "Unfavorited Successfully!",
                    favorited: user.favorited.includes(itemId.toString()) ? user.favorited.filter(f => f !== itemId.toString()) : user.favorited
                });
            case "rate":
                const {imageList, rate, desc, anonymous} = req.body;
                if ([imageList, rate, desc, anonymous].includes(undefined)) {
                    return res.status(400).json({
                        error: "uncompleted_form",
                        error_description: "Somethings is undefined in { imageList, rate, desc, anonymous }.",
                        code: 400,
                    });
                };
                let oldRating = item.rating ? item.rating : [];
                let newRating;
                if (oldRating.filter(r => r.user_id === user.user_id).length === 0) {
                    newRating = [
                        ...item.rating,
                        {
                            user_id: user.user_id,
                            imageList, rate, desc, anonymous,
                        }
                    ];
                } else {
                    newRating = [
                        ...oldRating.filter(r => r.user_id !== user.user_id),
                        {
                            user_id: user.user_id,
                            imageList, rate, desc, anonymous,
                        }
                    ]
                }

                item = await Items.findOneAndUpdate({_id: itemId}, {
                    rating: newRating
                });

                return res.status(200).json({
                    code: 200,
                    success: "rated",
                    msg: "Rated",
                    rating: newRating,
                });
            default:
                return res.status(400).json({
                    code: 400,
                    error: "invalid_action",
                    error_description: "Invalid Action",
                })
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "server_error",
            error_description: err.toString(),
            error_json: err,
            code: 500,
        });
    }
};

module.exports = {
    marked,
};
