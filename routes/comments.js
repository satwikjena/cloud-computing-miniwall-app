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

    // Validation to check if owner exists
    const userExists = await User.findOne({email:req.body.commentOwner})
    if(!userExists){
        return res.status(400).send({message:'Comment owner doesnot exist, provide a valid user'})
    }

    const postExists = await Post.findById(req.body.postId)
    if(!postExists){
        return res.status(400).send({message:'Post doesnot exist, provide a valid post'})
    }

    const commentData = new Comment({
        postId:req.body.postId,
        commentOwner:req.body.commentOwner,
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
    try{
        const comments = await Comment.find()
        res.send(comments)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// Read by id
router.get('/:commentId',verifyToken, async(req,res) =>{
    try{
        const getCommentById = await Comment.findById(req.params.commentId)
        res.send(getCommentById)
    }catch(err){
        res.send({message:err})
    }
})

// Update Comment
router.patch('/:commentId',verifyToken, async(req,res) =>{
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
    try{
        const deleteCommentById = await Comment.deleteOne({_id:req.params.commentId})
        res.send(deleteCommentById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router