const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        password: {type: String, required: true},
        isAdmin: {type: Boolean, default: false},
    },
    {timestamps: true}
);

module.exports = mongoose.model('user', userSchema);