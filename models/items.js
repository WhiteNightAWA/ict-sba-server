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
    }
});


module.exports = mongoose.model("Items", itemsSchema);
