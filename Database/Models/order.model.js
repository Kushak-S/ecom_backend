const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        uid: {type: String, required: true, unique: true},
        items: [
            {
                id: {type: String},
                type: {type: String, enum: ['product', 'service']},
                price: {type: Number},
                tax: {type: Number},
                quantity: {type: Number, default: 1},
            }
        ],
        total_amount: {type: Number, required: true, default: 0},
        mobile: {type: String, required: true},
        address: {type: String, required: true},
        status: {type: String,  default: "pending"},
    },
    {timestamps: true}
);

module.exports = mongoose.model('order', orderSchema);