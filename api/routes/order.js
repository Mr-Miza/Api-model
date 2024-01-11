const express = require('express') ;
const router = express.Router();
const mongoose = require('mongoose') ;

const Orders= require('../models/orders');
const product = require('../models/product');

router.get('/',(req,res,next)=> {
    Orders.find()
    .populate('product')
    .select("_id product quantity")
    .exec()
    .then(doc =>{
        console.log(doc);
        res.status(200).json({ 
            count: doc.length ,
            orders: doc.map(doc => {
                return {
                    _id: doc._id ,
                    product: doc.product,
                    quantity: doc.quantity ,
                        request: {
                        type: 'GET' ,
                        url: 'http://localhost:3000/order/' + doc._id
                    } 
                }
            })
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
}) ;

router.get('/:orderId',(req,res,next)=>{
    Orders.findById(req.params.orderId)
    .populate('product')
    .select('_id product quantity')
    .exec()
    .then(order=> {
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            })
        }
        res.status(200).json({
            order: order ,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/order'
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId',(req,res,next)=> {
    Orders.deleteOne({ _id:  req.params.orderId  })
    .exec() 
    .then(orderDeleted =>{
        console.log(orderDeleted);
        res.status(200).json({
            message: 'Order Deleted',
            request : {
                type: 'POST' ,
                url: 'localhost:3000/order',
                body:{
                    productID: 'ID',
                    quantity: 'Number'
                }
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err 
        })
    })
}) ;

 // continue at min 10:00 
router.post('/',(req,res,next)=> {
    product.findById(req.body.productID) // checks if the produt with the specified ID exists , then proceds to create the order
    .then(product=> {
        if(!product){ // returns a response when the porduct is not found 
            return res.status(404).json({message: 'Product NOT found'});
        }
        const orders = new Orders({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productID
        });
        return orders.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Order stored' ,
            OrderCreated: {
                _id: result._id,
                product:result.product,
                quantity:result.quantity
            },
            request: {
                type: 'POST',
                url: 'http://localhost:3000/order/'+ result._id
            }
        });
    })
    .catch(err => {
        console.log(err) ;
        res.status(500).json(err)
    })
});

module.exports = router ;
