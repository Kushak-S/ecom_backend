const mongoose = require('../Database/db_config');
const helper = require('../Helpers/item.helper');
const Cart = require('../Database/Models/cart.model');
const reqValidator = require('../Helpers/req.validator');

module.exports = {
    getById: async (req, res)=>{
        try{
            var cartItems = [];
            const uid = req.params.uid;
            const cart = await Cart.findOne({uid});
            if(!cart) return res.status(200).send({total_count:0,cartItems});
            for(const it of cart.items){
                const Type = helper.getType(it.type);
                const item = await Type.findById(it.id);
                if(item) cartItems.push({type: it.type, quantity: it.quantity, ...item._doc});
            }
            const total_count = cartItems.length;
            res.status(200).send({total_count, cartItems});
        }catch(err){
            res.status(500).send(err);
        }
    },

    add: async (req, res)=>{
        try{
            const {error, value} = reqValidator.cartOps(req.body);
            if(error) return res.status(400).send(error.details);

            const Type = helper.getType(value.item.type);
            const checkItem = await Type.findById(value.item.id);
            if(!checkItem) return res.status(404).send('Item not found in Inventory!');

            const item = value.item;
            const uid = req.params.uid;
            const cart = await Cart.findOne({uid});
            if(!cart){
                const newCart = new Cart({uid, items: [item]});
                const updatedCart = await newCart.save();
                res.status(200).send(updatedCart);
            }else{
                const itemIndex = cart.items.findIndex(
                    (it) => it.id === item.id && it.type === item.type
                );
                if(itemIndex !== -1){
                    cart.items[itemIndex].quantity += 1;
                }else{
                    cart.items.push(item);
                }
                const updatedCart = await cart.save();
                res.status(200).send(updatedCart);
            }
        }catch(err){
            res.status(500).send(err);
        }
    },

    remove: async (req, res)=>{
        try{
            const {error, value} = reqValidator.cartOps(req.body);
            if(error) return res.status(400).send(error.details);

            const item = value.item;
            const all = req.query.all;
            const uid = req.params.uid;
            const cart = await Cart.findOne({uid});
            if(!cart){
                res.status(200).send('Cart is already empty!');
            }else{
                const itemIndex = cart.items.findIndex(
                    (it) => it.id === item.id && it.type === item.type
                );
                if(itemIndex !== -1){
                    if (cart.items[itemIndex].quantity > 1 && (!all || all === false)) {
                        cart.items[itemIndex].quantity -= 1;
                    } else {
                        cart.items.splice(itemIndex, 1);
                    }

                    if(cart.items.length === 0){
                        await Cart.findOneAndDelete({uid});
                        return res.status(200).send('Cart is empty!');
                    }else{
                        const updatedCart = await cart.save();
                        res.status(200).send(updatedCart);
                    }
                    
                }else{
                    res.status(404).send('Item not found in the cart!');
                }
            }
        }catch(err){
            res.status(500).send(err);
        }
    },

    clear: async (req, res)=>{
        try{
            const uid = req.params.uid;
            const clearedCart = await Cart.findOneAndDelete({uid});
            if(!clearedCart) return res.status(200).send('Cart is already empty!');
            res.status(200).send(clearedCart);
        }catch(err){
            res.status(500).send(err);
        }
    },

}