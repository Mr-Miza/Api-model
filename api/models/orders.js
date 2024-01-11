const mongoose = require('mongoose') ;

// build a schema that is used as a format for the product , how a product should look like.
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    product: {
        type: mongoose.Schema.Types.ObjectId , 
        ref:'Product' ,// the ref is used to make the relation connection with the Product schema
        required: true,
    },
    quantity: {
        type:Number , 
        default:1 
    }
}); 

// Suposing that the "Product" is the label for the schema in a database ( not sure tho)

module.exports= mongoose.model('Order',orderSchema) ;