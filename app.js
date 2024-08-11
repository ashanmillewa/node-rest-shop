const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

mongoose.connect('mongodb+srv://ASHANMILLEWA:11AIM2000@node-rest-shop.kt3y0.mongodb.net/node-rest-shop');

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-control-allow-origin', '*');
    res.header('Access-control-allow-headers', 'Origin, X-Requested-With, context-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.hasHeader('Access-control-allow-methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status.apply(200).json({});
    }
    next();
})

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
