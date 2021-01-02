const express = require('express');
const router  = express.Router();
const mongoose = require('../model/mogoose')
const User = require('../model/user')
const {registerValidate,loginValidaate} = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();


router.get('/',(req,res)=>{
    res.json({
        message : "auth home"
    })
})

router.post('/signup',async (req,res)=>{
 
     //const {name,email,password}  = req.body;
    // console.log(name,email,password);
    // validation
   const {error} = registerValidate(req.body);
    if(error){
        console.log(error.details[0].message);
       return res.json({error : error.details[0].message});
    }

    //Checking email
   const emailExist =  await User.findOne({email:req.body.email});
     if(emailExist){
         console.log("email already exits")
        return res.json({error:"email already exists"});
     } 

     const salt = await bcrypt.genSalt(11);
     const hashpass = await bcrypt.hash(req.body.password,salt);
    


     const user = new User({
         name : req.body.name,
         email : req.body.email,
         password : hashpass
     });
    
     try {
         await user.save().then((user)=>{
             
             console.log("user added")
             res.json({message:"Account created successfully!"})

         })
     } catch (error) {
         console.log(error)
     }
     



})

router.get('/logout',(req,res)=>{
    res.clearCookie('authToken',{httpOnly:true});
    res.json({
        message: "logout successs"
    })
    res.redirect('/login');
    
})

router.post('/login',async (req,res)=>{
    const {email} = req.body;
    const {error} = loginValidaate(req.body);
    if(error){
        console.log(error.details[0].message);
       return res.json({error : error.details[0].message});
    }
    const user = await User.findOne({email:email})
    if(!user) return res.json({
         error  : "you are not registered"
    })

    const pass = await bcrypt.compare(req.body.password,user.password);
    if(!pass) return res.json({
        error : "incorrect password"
    })


     const token = jwt.sign({_id:user._id},process.env.TOKEN,{expiresIn:60*60});
     if(token){
        res.cookie("authToken",token,{httpOnly:true});
        const {_id,name,email,followers,following,profile,profilePublicId} = user;
        res.json({token:token,user:{_id,name,email,followers,following,profile,profilePublicId}})
     }



   ;


})



module.exports = router;