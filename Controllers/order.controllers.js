const mongoose = require('../Database/db_config');
const helper = require('../Helpers/item.helper');
const Cart = require('../Database/Models/cart.model');
const Order = require('../Database/Models/order.model');
const reqValidator = require('../Helpers/req.validator');

module.exports = {
    getAll: async (req, res)=>{
        try{
            const orders = await Order.find();
            if(!orders) return res.status(200).send('No orders found!');
            res.status(200).send(orders);
        }catch(err){
            res.status(500).send(err);
        }
    },

    getByUid: async (req, res)=>{
        try{
            const uid = req.params.uid;
            const order = await Order.find({uid});
            if(!order) return res.status(200).send('No orders found!');
            res.status(200).send(order);
        }catch(err){
            res.status(500).send(err);
        }
    },
    
    confirm: async (req, res)=>{
        try{
            const {error, value} = reqValidator.confirmOrder(req.body);
            if(error) return res.status(400).send(error.details);

            var orderItems = [];
            var total_amount = 0;
            const uid = req.params.uid;
            const cart = await Cart.findOne({uid});
            if(!cart) return res.status(200).send('Cart is empty!');
            for(const it of cart.items){
                const Type = helper.getType(it.type);
                const item = await Type.findById(it.id);
                if(item){
                    const price = item.price;
                    const tax = helper.getTax(it.type, price);
                    total_amount += (price + tax)*it.quantity;
                    orderItems.push({id: it.id, type: it.type, price, tax, quantity: it.quantity});
                }
            }
            const order = new Order({uid, items: orderItems, total_amount, address: value.address, mobile: value.mobile});
            const savedOrder = await order.save();
            await Cart.findOneAndDelete({uid});
            res.status(200).send(savedOrder);
        }catch(err){
            res.status(500).send(err);
        }
    },
    
    cancel: async (req, res)=>{
        try{
            const {error, value} = reqValidator.cancelOrder(req.body);
            if(error) return res.status(400).send(error.details);

            const order_id = value.order_id;
            const cancelledOrder = await Order.findByIdAndDelete(order_id);
            if(!cancelledOrder) return res.status(200).send('No order found!');
            res.status(200).send(cancelledOrder);
        }catch(err){
            res.status(500).send(err);
        }
    },

    checkout: async (req, res)=>{
        try{
            const uid = req.params.uid;
            var orderItems = [];
            var total_amount = 0;
            const cart = await Cart.findOne({uid});
            if(!cart) return res.status(200).send('Cart is empty!');
            for(const it of cart.items){
                const Type = helper.getType(it.type);
                const item = await Type.findById(it.id);
                if(item){
                    const tax = helper.getTax(it.type, item.price);
                    total_amount += (item.price + tax)*it.quantity;
                    orderItems.push({type: it.type, quantity: it.quantity, tax, ...item._doc});
                }
            }
            res.status(200).send({uid, orderItems, total_amount});
        }catch(err){
            console.log(err)
            res.status(500).send(err);
        }
    },
    
}