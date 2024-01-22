const mongoose = require('mongoose') ;

// build a schema that is used as a format for the product , how a product should look like.
const userschema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId ,
    email: {
        type: String ,
        required: true,
        unique :true , // this means no two user can have same username
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
    password: { type: String, required: true},
}); 

// Suposing that the "Product" is the label for the schema in a database ( not sure tho)

module.exports= mongoose.model('user',userschema) ;