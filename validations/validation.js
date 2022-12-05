const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:joi.string().required().min(3).max(256),
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:joi.string().required().min(6).max(256).email(),
        password:joi.string().required().min(6).max(1024)        
    })
    return schemaValidation.validate(data)
}

const postUserValidation = (data) => {
    const schemaValidation = joi.object({
        postTitle:joi.string().required().min(6).max(1024),
        postOwner:joi.string().required().min(6).max(256),
        postDescription:joi.string().required().min(50).max(2056)
    })
    return schemaValidation.validate(data)
}

const commentValidation = (data) => {
    const schemaValidation = joi.object({
        postId:joi.string().required(),
        commentOwner:joi.string().required().min(6).max(256),
        commentText:joi.string().required().min(10).max(2056)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postUserValidation = postUserValidation
module.exports.commentValidation = commentValidation