const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        uid: {type: String, required: true, unique: true},
        items: [
            {
                id: {type: String},
                type: {type: String, enum: ['product', 'service']},
                quantity: {type: Number, default: 1},

            }
        ]
    },
    {timestamps: true}
);

module.exports = mongoose.model('cart', cartSchema);