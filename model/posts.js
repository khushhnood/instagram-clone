const mongoose =  require('mongoose')
const schema =  mongoose.Schema;



const Postschema = new schema({
    postedBy : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    caption : {
        type : String,
        required : true
    },
    likes :[{type : mongoose.Schema.Types.ObjectId, ref : "user" }],
    comments : [
        {
            text : String,
            postedBy:{type : mongoose.Schema.Types.ObjectId, ref : "user"}

        }
    ],
    photo : {
        type : String,
        default : "no photo",
        required : true
    },
    publicId : {
        type : String,
        required: true
    }
},{timestamps:true})

const Posts = mongoose.model("Posts",Postschema);
module.exports = Posts;