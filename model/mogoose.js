const mongoose = require('mongoose');
const schema = mongoose.Schema;
const dotenv = require('dotenv');
dotenv.config();

 const connect =  mongoose.connect(process.env.MONGOURI,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false},(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("mongo connected")
    }
});
  
module.exports = connect;



