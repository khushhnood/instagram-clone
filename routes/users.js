const express = require('express');
const router  = express.Router();
const mongoose = require('../model/mogoose')
const User = require('../model/user')
const PostSchema = require('../model/posts')
const verifyLogin = require('../middlewares/verifyLogin')

router.get('/profile/:id',verifyLogin,async(req,res)=>{
    const id = req.params.id;
   await User.findOne({_id:id}).select("-password")
   .then(user=>{
       PostSchema.find({postedBy:id}).populate("postedBy","_id name").exec((err,posts)=>{
           if(err){
               res.status(422).json({error:err})
           }
           res.json({user,posts});
       })
   }).catch(err=>res.status(422).json({error:"no user"}))

})

router.put('/follow',verifyLogin,async(req,res)=>{
    const followid =  req.body.followid;
  const finduser =   await User.findByIdAndUpdate({_id:followid},{
        $push : {followers : req.user._id}
    },{new:true})

    if(finduser){
        await User.findByIdAndUpdate({_id:req.user._id},{
            $push:{following:followid}
        },{new:true}).then(result=>res.json(result)).catch(err=>res.status(422).json({error:err}))
    }
   
})

router.put('/unfollow',verifyLogin,async(req,res)=>{
    const unfollowid =  req.body.unfollowid;
    await User.findByIdAndUpdate({_id:unfollowid},{
        $pull : {followers : req.user._id}
    },{new:true},
        (err,result)=>{
         if(err){
             res.status(422).json({error : err})
         }else{
            User.findByIdAndUpdate({_id:req.user._id},{
                $pull:{following:unfollowid}
            },{new:true}).then(result=>res.json(result)).catch(err=>res.status(422).json({error:err}))
         }
        }
    )
})

router.put('/edit',verifyLogin,async(req,res)=>{
    const {profile,profilePublicId} = req.body
    try {
        await User.findByIdAndUpdate({_id:req.user._id},{
        profile : profile,
        profilePublicId : profilePublicId
        },{new:true},(err,result)=>{
            if(err){
                res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
    } catch (error) {
        res.status(422).json({error:error})
    }
})






module.exports = router