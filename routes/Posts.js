const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const PostSchema = require('../model/posts')
const verifyLogin = require('../middlewares/verifyLogin'); 


router.post('/createpost',verifyLogin,async (req,res)=>{
         console.log(`req body : ${req.body} and req user ${req.user}`);
         const {caption,photo,publicId} = req.body;
         console.log(` caption : ${caption} and photot ${photo}`)
         
         //validation
          console.log("user data :"+req.user)
         //creating posst
         var post = new PostSchema({
            caption : caption,
             photo : photo,
             publicId : publicId,
             postedBy : req.user
         })

         try{
           await post.save().then((data)=>{
                console.log("post added")
                res.json({
                    created : data
                })
            })
             
            // return res.json({
                // message : "post saved successfully"
            // })
         }catch(e){
             console.log(e)
         }

})

router.get('/all',verifyLogin, async (req,res)=>{
           const posts = await PostSchema.find({}).populate("postedBy","_id name profile")
           .populate("comments.postedBy","_id name").sort("-createdAt");
          
           if(!posts){
               return res.json({
                   message : "no posts"
               })
           }

           return res.json({
               message : posts
           });
})

router.get('/my',verifyLogin,async(req,res)=>{
    try {
        const mypost = await PostSchema.find({postedBy:req.user._id}).populate("postedBy","_id name profile").sort("-createdAt");
        
        if(mypost.length==0) return res.json({
            error : "no posts to show"
        })

        return res.json({
            mypost : mypost
        })
    } catch (error) {
        console.log(error)
    }
})

router.put('/like',verifyLogin,async(req,res)=>{
    await PostSchema.findByIdAndUpdate(req.body.postId,{
        $push : {likes : req.user._id}
    },{
        new : true
    }).exec((err,result)=>{
           if(err){
               return res.status(422).json({
                   error : err
               })
           }else{
               res.json(result)
           }
    })
})

router.put('/unlike',verifyLogin,async(req,res)=>{
    await PostSchema.findByIdAndUpdate(req.body.postId,{
        $pull : {likes : req.user._id}
    },{
        new : true
    }).exec((err,result)=>{
           if(err){
               return res.status(422).json({
                   error : err
               })
           }else{
               res.json(result)
           }
    })
})

router.put('/comment',verifyLogin,async(req,res)=>{
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    await PostSchema.findByIdAndUpdate(req.body.postId,{
        $push : {comments : comment }
    },{
        new : true
    }).populate("comments.postedBy","_id name")
    .exec((err,result)=>{
           if(err){
               return res.status(422).json({
                   error : err
               })
           }else{
               res.json(result)
           }
    })
})

router.put('/uncomment',verifyLogin,async(req,res)=>{
    const commentId = req.body.commentId;
    console.log("comment id :",commentId)
    await PostSchema.findByIdAndUpdate(req.body.postId,{
        $pull : {comments : {_id : commentId} }
    },{
        new : true
    }).populate("comments.postedBy","_id name")
    .exec((err,result)=>{
           if(err){
               return res.status(422).json({
                   error : err
               })
           }else{
               res.json(result)
           }
    })
})


router.delete('/delete/:id',verifyLogin,async(req,res)=>{
    const postId = req.params.id;


    try {
        await PostSchema.findOne({_id:postId}).populate("postedBy","_id").exec((err,post)=>{
            if(err || !post){
                return res.status(422).json({error : err})
            }
            if(post.postedBy._id.toString()===req.user._id.toString()){
                post.remove().then(result=>{
                    res.json({message:"post deelted"})
                }).catch(err=>{
                    console.log(err);
                    res.status(422).json({error: err})
                })
            }
        })
        
    } catch (error) {
        console.log(error)
    }

   
})




module.exports = router;