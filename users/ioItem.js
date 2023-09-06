const User = require("../models/user");
const Shop = require("../models/shop");
const Items = require("../models/items");
const {hash} = require("bcrypt");
const {ObjectId} = require("mongodb");


const ioItem = async (req, res) => {
    try {
        let { count, barCode } = req.body;
        let { itemId } = req.params;
        if ([ itemId ].includes(undefined)) {
            return res.status(400).json({
                error: "uncompleted_form",
                error_description: "Somethings is undefined in { itemId }.",
                code: 400,
            });
        }

        let user = await User.findOne({ user_id: req.user_id });

        switch (user.type) {
            case "sell":
                try {
                    itemId = new ObjectId(itemId);
                } catch (err) {
                    return res.status(400).json({
                        error: "invalid_itemId",
                        error_description: "Invalid Item Id.",
                        err: err.toString(),
                        code: 400,
                    });
                }

                const item = await Items.findOne({ _id: itemId });
                if (!item) {
                    return res.status(400).json({
                        error: "invalid_item",
                        error_description: "Invalid Item.",
                        code: 400,
                    });
                }
                if (item.shopId.toString() !== user.shop.toString()) {
                    return res.status(400).json({
                        error: "incorrect_shop",
                        error_description: "Incorrect shop.",
                        code: 400,
                    });
                }

                let record = item.record ? item.record : [];

                if (barCode === undefined) {
                    if ([ count ].includes(undefined)) {
                        return res.status(400).json({
                            error: "uncompleted_form",
                            error_description: "Somethings is undefined in { count }.",
                            code: 400,
                        });
                    }
                    if (isNaN(Number(count))) {
                        return res.status(400).json({
                            error: "nan_count",
                            error_description: "NaN number count",
                            code: 400,
                        });
                    }
                    if (item.barCode) {
                        return res.status(400).json({
                            error: "is_barCode",
                            error_description: "This item is using barcode to io.",
                            code: 400,
                        });
                    }
                    count = Number(count)

                    if (count > 0) {
                        record.push({
                            time: new Date(),
                            count: count,
                        })
                        const item = await Items.findOneAndUpdate({_id: itemId}, {record: record});
                        item.record = record;
                        return res.status(200).json({
                            code: 200,
                            success: "io_successfully",
                            msg: "IO Successfully!",
                            item: item
                        });
                    } else if (count < 0) {

                        if (Math.abs(count) > record.map((i, index) => i.count) || record.length === 0) {
                            return res.status(400).json({
                                error: "not_enough",
                                error_description: "Not enough this item in stock.",
                                code: 400,
                            });
                        }
                        record = record.sort((a, b) => a.time - b.time);

                        count = Math.abs(count);

                        while (count > 0) {
                            let left = record[0].count;
                            if (left > 0) {
                                let minus = count >= left ? left : count;
                                record[0].count -= minus;
                                count -= minus;
                            }
                            if (record[0].count <= 0) {
                                record = record.splice(1)
                            }
                        }

                        const item = await Items.findOneAndUpdate({_id: itemId}, {record: record});
                        item.record = record;
                        return res.status(200).json({
                            code: 200,
                            success: "io_successfully",
                            msg: "IO Successfully!",
                            item: item
                        });
                    } else {
                        return res.status(400).json({
                            error: "zero_count",
                            error_description: "Count is zero.",
                            code: 400,
                        });
                    }
                } else {
                    if (!item.barCode) {
                        return res.status(400).json({
                            error: "is_not_barCode",
                            error_description: "This item is not using barcode to io.",
                            code: 400,
                        });
                    }
                    let b = record.find(r => r.barCode === barCode);
                    if (b) {
                        record = record.filter(r => r.barCode !== barCode);
                    } else {
                        record.push({
                            time: new Date(),
                            barCode: barCode,
                        })
                    }
                    const item = await Items.findOneAndUpdate({_id: itemId}, {record: record});
                    item.record = record;
                    return res.status(200).json({
                        code: 200,
                        success: "io_successfully",
                        msg: "IO Successfully!",
                        item: item
                    });
                }
            case "user":
                return res.status(400).json({
                    code: 400,
                    error: "type_error",
                    error_description: "You are not a seller!",
                });
            default:
                return res.status(400).json({
                    code: 400,
                    error: "invalid_type",
                    error_description: "Invalid Type!",
                });
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
    ioItem,
};
