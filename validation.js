const joi  = require('@hapi/joi');

const registerValidate = (data) =>{
    const schema = joi.object({
        name : joi.string().required(),
        email : joi.string().email().required(),
        password: joi.string().required().min(6)
        });

    return schema.validate(data);
}

const loginValidaate = (data) =>{
    const schema = joi.object({
        email : joi.string().required().email(),
        password : joi.string().required().min(6)
    })

    return schema.validate(data);
}

module.exports.loginValidaate  = loginValidaate;
module.exports.registerValidate = registerValidate;