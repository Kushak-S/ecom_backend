const mongoose = require('mongoose');

const servieSchema = mongoose.Schema(
    {
        title: {type: String , required: true, unique: true},
        desc: {type: String , required: true},
        img: {type: String , required: true},
        price: {type: Number , required: true},
        categories: {type: Array},
    },
    {timestamps: true}
);

module.exports = mongoose.model('service', servieSchema);