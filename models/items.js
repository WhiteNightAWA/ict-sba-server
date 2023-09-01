const mongoose = require("mongoose");
const {ObjectId} = require("mongodb");


const itemsSchema = new mongoose.Schema({
    imageList: [String],
    selectedCategory: [String],
    others: Boolean,
    selectedCategoryOther: String,

    name: String,
    count: String,
    unit: String,
    desc: String,

    price: [[Number, Number]],

    shopId: ObjectId,

    barCode: Boolean,
    record: [{
        time: Date,
        barCode: String,
        count: Number,
    }],

    visible: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },

    rating: [{
        imageList: [String],
        rate: Number,
        user_id: String,
        name: String,
        desc: String,
        anonymous: Boolean,
        lastEdit: Date,
    }]
});


module.exports = mongoose.model("Items", itemsSchema);
