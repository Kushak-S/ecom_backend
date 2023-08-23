const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

const validator = (schema)=>(payload)=>schema.validate(payload, {abortEarly:false});

const signup = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(6).required(),
    isAdmin: joi.boolean().default(false),
});

const login = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});

const additem = joi.object({
    type: joi.string().valid('product', 'service').required(),
    title: joi.string().min(3).required(),
    desc: joi.string().min(3).required(),
    img: joi.string().required(),
    price: joi.number().min(0).required(),
    categories: joi.array().items(joi.string()).required(),
});

const deleteitem = joi.object({
    type: joi.string().valid('product', 'service').required(),
    item_id: joi.objectId().required(),
});

const cartops = joi.object({
    item: joi.object({
        type: joi.string().valid('product', 'service').required(),
        id: joi.objectId().required(),
    }),
});

const confirmorder = joi.object({
    address: joi.string().min(3).required(),
    mobile: joi.string().min(10).max(10).required(),
});

const cancelorder = joi.object({
    order_id: joi.objectId().required(),
});

module.exports = {
    signup: validator(signup),
    login: validator(login),
    addItem: validator(additem),
    deleteItem: validator(deleteitem),
    cartOps: validator(cartops),
    confirmOrder: validator(confirmorder),
    cancelOrder: validator(cancelorder),
}