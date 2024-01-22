const express= require('express');
const mongoose= require('mongoose');
const router= express.Router();

const bcrypt = require('bcrypt');


const User = require('../models/userSchema') ;

router.post('/signup',(req,res,next)=>{
User.find({email: req.body.email}) 
.exec()
.then(user=> {
    if(user.length >=1){ // by using User.find it returns an empty array ,which resulted in not null at the if statment. So we put that condition there
        return res.status(409).json({
            message: 'Mail exists'
        });
    }
    else {
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
                    password: doc.password,
                    _id: doc._id
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

 router.delete('/:email', (req,res,next)=> { // if we put this path '/delete/:email' we need to add 'delete' to our url so the user gets deleted 
    const emailAddr = req.body.email ;
    User.deleteOne({
        email : emailAddr
    })
    .exec()
    .then(action => {
        console.log(action) ;
        res.status(200).json({
            message: 'The user is removed' 
        })
        .catch(err => {
            console.log(err) ;
            res.status(500).json(err) ;
        }) ;

    });
 });

 router.patch('/:userID', (req,res,next)=> {
    const id = req.body.userID ;
    const updateOps = {} ;
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value ;
    }
    User.update({_id: id},{
        $set: updateOps})
    .exec()
    .then(()=>{
        res.status(200).json({
            message: "User updated",
            request: {
                type: 'GET' ,
                url: 'http://localhost:3000/user/' + id
            }
        }) ;

    })
 })


module.exports = router 