const Product = require('../Database/Models/product.model');
const Service = require('../Database/Models/service.model');

module.exports = {
    getType : (type)=>{
        if(type === 'service') return Service;
        if(type === 'product') return Product;
        return null;
    },
    
    getTax : (type, price)=>{
        if(type === 'service'){
            if(price <= 1000)return 100;
            else if(price > 1000 && price <= 8000)return price*0.10;
            else return price*0.15;
        }else if(type === 'product'){
            if(price <= 1000)return 200;
            else if(price > 1000 && price <= 5000)return price*0.12;
            else return price*0.18;
        }
    }
}