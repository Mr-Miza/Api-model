const mongoose = require('mongoose') ;

// build a schema that is used as a format for the product , how a product should look like.
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    name: {type: String , required: true} ,
    price: {type: Number , required: true},
    productImage: { type: String , required: true }
}); 

// Suposing that the "Product" is the label for the schema in a database ( not sure tho)

module.exports= mongoose.model('Product',productSchema) ;