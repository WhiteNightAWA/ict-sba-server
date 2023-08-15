const mongoose = require("mongoose");


const shopSchema = new mongoose.Schema({
    fn: String,
    ln: String,
    HKID: String,
    vat: String,
    shopName: String,
    shopDesc: String,
    avatar: String,
    shopPhotos: [String],
    phone: Number,
    short: String,
    rating: [{
        username: String,
        nick: Boolean,
        rate: Number,
        comment: String,
        time: Date,
    }],
    position: [

    ]
});


module.exports = mongoose.model("Shop", shopSchema);
