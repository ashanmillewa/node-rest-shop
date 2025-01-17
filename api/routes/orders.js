const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const { request } = require('../../app');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            tupe: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    const { productId, quantity } = req.body;


    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: quantity,
                product: productId
            });

            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message || 'An error occurred'
            });
        });
});


router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', (req, res, next) => {
    console.log(`Attempting to delete order with ID: ${req.params.orderId}`);

    // Find and delete the order by ID
    Order.findByIdAndDelete(req.params.orderId)
        .then(result => {
            if (!result) {
                console.log(`Order with ID: ${req.params.orderId} not found.`);
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            console.log(`Order with ID: ${req.params.orderId} successfully deleted.`);
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            });
        })
        .catch(err => {
            console.error(`Error deleting order with ID: ${req.params.orderId}`, err);
            res.status(500).json({
                error: err.message // Return only the error message
            });
        });
});







module.exports = router;