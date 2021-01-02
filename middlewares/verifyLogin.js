const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const user =  require('../model/user')


dotenv.config();

const verifyMiddleware = async (req,res,next)=>{
    const token = req.cookies['authToken'];
    if(!token) return res.json({
        error : "access denied"
    })

   
        const verify = jwt.verify(token,process.env.TOKEN);
        if(verify){
            const {_id} = verify;
             
            try {
                await user.findById(_id,(err,data)=>{
                    if(err){
                        console.log(err)
                    }
                    req.user = data;
                    
                    next();
                })
            } catch (error) {
                console.log(error)
            }
            

        
            
        }else{
            return res.json({
                error : "token not verified"
            })
        }
   
}

module.exports = verifyMiddleware;