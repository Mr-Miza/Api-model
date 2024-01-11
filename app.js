const express = require('express') ;
const app = express() ; 
const morgan = require('morgan') ;  //the request pass here so the morgan do some procedure ( locks smth)
                                    // Morgan: morgan is a middleware for logging HTTP requests. 
                                    //It logs information about incoming requests, such as the HTTP method, URL, status code, response time, and more.
                                    // This can be helpful for debugging and monitoring the behavior of your API.
                                    //Example of using morgan for logging:

  const bodyParser = require('body-parser') ;
/* body-parser is a middleware that parses the incoming request body.
    body-parser helps in extracting that data and making it available in your route handlers.*/ 
const mongoose = require('mongoose') ;

//adding the msg to try the git , ignore it 

const productRoutes = require('./api/routes/products') ; // requires the product.js file 
const orderRoutes = require('./api/routes/order');
const userRoutes = require ('./api/routes/user') ;

mongoose.connect('mongodb+srv://'+process.env.Mongo_usrName+
    ':'+process.env.Mongo_pass+
        '@cluster0.laqgwil.mongodb.net/?retryWrites=true&w=majority');

mongoose.Promise= global.Promise; // controlls the waraings ( some type deprication or smth)

app.use(morgan('dev')) ;
app.use( '/someDST',express.static('someDST'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{ // we do thsi so whenever a response is sent , it goes through this change 
         res.header('Access-Control-Allow-Origin' , "*") ; // the star gives acess to everything , u can restrict it 
         //by putting the url of the page u want to give acces 
         res.header("Access-Control-Allow-Header", 'Origin,X-Requested-With , Content-Type, Accept , Authorization') ;
if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET') ;
    return res.status(200).json({}) ;
}
next();
})

//sets up the middleware , so the request goes through this method 
app.use('/product' , productRoutes); // it works as a filter about the path 
/* so the meaning of this is that .. whatever is in the URL if it starts with /products ,
 it will be sent to the products.js file ( basically the ' get' method). But we have to be carefull to not use the same path ( /products)
 in the get method in the products.js file */ 

 app.use('/order' , orderRoutes);
 app.use('/user', userRoutes)

 app.use((req, res,next)=>{
    const error = new Error ('Not found') ;
    error.status=404 ;
    next(error);
 });


 app.use((error,req,res,next)=> {
        res.status(error.status || 500) ;
        res.json({
            error:{
                message: error.message
            }
        })
 });

module.exports=app ;