const express = require('express');
require('dotenv').config();
const userRoutes = require('./Routers/user.routes');
const itemRoutes = require('./Routers/item.routes');
const cartRoutes = require('./Routers/cart.routes');
const orderRoutes = require('./Routers/order.routes');

const app = express();

app.use(express.json());
app.use('/user',userRoutes);
app.use('/product',itemRoutes);
app.use('/cart',cartRoutes);
app.use('/order',orderRoutes);

app.get('/', (req, res)=>res.send('server running...'));

app.listen(process.env.PORT | 3000, ()=>{
    console.log(`App listening!`);
});