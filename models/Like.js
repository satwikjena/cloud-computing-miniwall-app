const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({

    postId:{
        type:String,
        require:true
    },
    likeOwner:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('likes',likeSchema)