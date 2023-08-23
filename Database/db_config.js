const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.DB_CONFIG, {dbName:'Ecom'}).then(
    () => console.log('Database connected')
).catch(err => console.log(`Database connection error: ${err}`));

module.exports = mongoose;