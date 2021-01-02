const express = require('express')
const router = express.Router();
const { cloudinary } = require('../utils/cloudinary')
const verifyLogin = require('../middlewares/verifyLogin')



router.post('/',verifyLogin,async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'insta-clone',
        });
      
        res.json({ msg: 'succesfully uploaded' , urldata : uploadResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

router.post('/delete',verifyLogin,async(req,res)=>{
    try {
        const publicId = req.body.publicId;
        const deleteResponse = cloudinary.uploader.destroy(publicId, function(error,result) {
            if(error){
                console.log(error);
                res.status(422).json({error:error})
            }else{
                res.json(result);
            }
         })
    } catch (error) {
        console.log(error);
        res.status(422).json({error:error})
    }
})


module.exports = router;