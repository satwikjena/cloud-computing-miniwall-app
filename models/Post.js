const mongoose = require('mongoose')

const postSchema = mongoose.Schema({

    postTitle:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    postOwner:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    postDescription:{
        type:String,
        require:true,
        min:50,
        max:2056
    },
    like:{
        type:Number,
        require:false,
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('posts',postSchema)