const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('./model/mogoose');
const userModel = require('./model/user');
const postSchema = require('./model/posts');
const Postroutes = require('./routes/Posts');
const userprofile = require('./routes/users')
const auth = require('./routes/auth');
const uploadRoutes = require('./routes/upload')
const cookieParser = require('cookie-parser');
const verifyLogin = require('./middlewares/verifyLogin')
const PORT = process.env.PORT || 4000;


app.use(cookieParser());
app.use(bodyparser.json({limit:'50mb'}));
app.use(bodyparser.urlencoded({limit:'50mb',extended:true}));
app.use('/auth',auth);
app.use('/post',Postroutes);
app.use('/upload',uploadRoutes);
app.use('/users',userprofile)
//app.use(middle);
app.get('/',verifyLogin,(req,res)=>{
    res.send("hiiii");
  
})

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


app.listen(PORT,()=>{
    console.log(`app runnning on port ${PORT}`)
});
