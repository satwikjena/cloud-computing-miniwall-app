const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')
const verifyToken = require('../verifyToken')

const {commentValidation} = require('../validations/validation')



// Create new comment
router.post('/',verifyToken,async(req,res)=>{

    // Validation to check user input
    const {error} = commentValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    const postExists = await Post.findById(req.body.postId)
    if(!postExists){
        return res.status(400).send({message:'Post doesnot exist, provide a valid post'})
    }

    const user = await User.findById(req.user._id)
    const postOwnerEqualsUser = postExists['postOwner'] === user['email']
    if(postOwnerEqualsUser){
        return res.status(400).send({message:'Post Owner canot comment on his own post'})
    }

    const commentData = new Comment({
        postId:req.body.postId,
        commentOwner:user['email'],
        commentText:req.body.commentText
    })
    try{
        const commentToSave = await commentData.save()
        res.send(commentToSave)
    }catch(err){
        res.send({message:err})
    }
})

// Read all
router.get('/', verifyToken, async(req,res) =>{
    const user = await User.findById(req.user._id)
    try{
        const comments = await Comment.find({commentOwner:user['email']})
        res.send(comments)
    }catch(err){
        res.status(400).send({message:err})
    }
})


// Update Comment
router.patch('/:commentId',verifyToken, async(req,res) =>{

    const user = await User.findById(req.user._id)
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        return res.status(400).send({message:'Comment doesnot exist,please provide a valid Comment'})
    }
    const postOwnerNotEqualsUser = comment['commentOwner'] !== user['email']
    if(postOwnerNotEqualsUser){
        return res.status(400).send({message:'Comment Owner can only update comment'})
    }
    try{
        const updateCommentById = await Comment.updateOne(
            {_id:req.params.commentId},
            {$set:{
                postId:req.body.postId,
                commentOwner:req.body.commentOwner,
                commentText:req.body.commentText
                }
            })
        res.send(updateCommentById)
    }catch(err){
        res.send({message:err})
    }
})

// delete Comment
router.delete('/:commentId',verifyToken,async(req,res)=>{
    const user = await User.findById(req.user._id)
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        return res.status(400).send({message:'Comment doesnot exist,please provide a valid Comment'})
    }
    const postOwnerNotEqualsUser = comment['commentOwner'] !== user['email']
    if(postOwnerNotEqualsUser){
        return res.status(400).send({message:'Comment Owner can only delete comment'})
    }
    try{
        const deleteCommentById = await Comment.deleteOne({_id:req.params.commentId})
        res.send(deleteCommentById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router