const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({

    postId:{
        type:String,
        require:true
    },
    commentOwner:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    commentText:{
        type:String,
        require:true,
        min:50,
        max:2056
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('comments',commentSchema)