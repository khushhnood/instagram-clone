const mongoose  = require('mongoose')
const schema = mongoose.Schema;


const userSchema = new schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required : true
    },
    profile : {
        type : String
    },
    profilePublicId : {
         type : String
    },
    followers : [{type: mongoose.Schema.Types.ObjectId , ref : "user" }],
    following : [{type: mongoose.Schema.Types.ObjectId , ref : "user" }],
    password : {
        type : String,
        required : true
    }
},{collection:'user'});

var user = mongoose.model('user',userSchema);
module.exports = user;
