const express= require('express');
const mongoose= require('mongoose');
const router= express.Router();

const bcrypt = require('bcrypt');


const User = require('../models/userSchema') ;

router.post('/signup',(req,res,next)=>{
    bcrypt.hash( req.body.password , 10 , (err ,hash) => {
        if(err){
            res.status(500).json({error: "error here"}) ;
        }
        else {
            const  user = new User({
                _id: new mongoose.Types.ObjectId() ,  // using this method for email or pass ->( password: req.body.password ) stores the raw email or pass in the database, big security issue
                email: req.body.email,
                password: hash
            });
            user
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: " 1-st user created"
                });
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
            
    });
});

router.get('/list', (req,res,next)=> {
    User.find()
    .exec()
    .then(docs => {
        const respone ={ 
            count: docs.legnth ,
            user: docs.map(doc=>{
                return{
                    email: doc.email,
                    password: doc.password
                }
            })
        }
        console.log(respone);
        res.status(200).json(respone);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
     });
 });




module.exports = router 