const mongoose = require('../Database/db_config');
const helper = require('../Helpers/item.helper');
const reqValidator = require('../Helpers/req.validator');

module.exports = {
    getAll: async (req, res)=>{
        const Type = helper.getType(req.query.type);
        if(!Type) return res.status(400).send('Invalid request!');

        try{
            const items = await Type.find();
            res.status(200).send(items);
        }catch(err){
            console.log(err);
            res.status(500).send(err);
        }
    },

    getById: async (req, res)=>{
        try{
            const Type = helper.getType(req.query.type);
            if(!Type) return res.status(400).send('Invalid request!');
            const item = await Type.findById(req.params.id);
            if(!item) return res.status(404).send('Item not found!');
            res.status(200).send(item);
        }catch(err){
            res.status(500).send(err);
        }
    },

    add: async (req, res)=>{
        try{
            const {error, value} = reqValidator.addItem(req.body);
            if(error) return res.status(400).send(error.details);
    
            const Type = helper.getType(value.type);
            const newItem = new Type({
                title: value.title,
                desc: value.desc,
                img: value.img,
                price: value.price,
                categories: value.categories,
            });

            const savedItem = await newItem.save();
            res.status(200).send(savedItem);
        }catch(err){
            res.status(500).send(err);
        }
    },

    delete: async (req, res)=>{
        try{
            const {error, value} = reqValidator.deleteItem(req.body);
            if(error) return res.status(400).send(error.details);

            const Type = helper.getType(value.type);
            const deletedItem = await Type.findByIdAndDelete(value.item_id);
            if(!deletedItem) return res.status(404).send('Item does not exist!');
            res.status(200).send(deletedItem);
        }catch(err){
            res.status(500).send(err);
        }
    },
}