const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const User = require('../models/User')
const verifyToken = require('../verifyToken')

const {postUserValidation} = require('../validations/validation')



// Create new post
router.post('/',verifyToken,async(req,res)=>{

    // Validation to check user input
    const {error} = postUserValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation to check if owner exists
    const userExists = await User.findOne({email:req.body.postOwner})
    if(!userExists){
        return res.status(400).send({message:'Post owner doesnot exist, provide a valid user'})
    }

    const postData = new Post({
        postTitle:req.body.postTitle,
        postOwner:req.body.postOwner,
        postDescription:req.body.postDescription
    })
    try{
        const postToSave = await postData.save()
        res.send(postToSave)
    }catch(err){
        res.send({message:err})
    }
})

// Read all
router.get('/', verifyToken, async(req,res) =>{
    try{
        const posts = await Post.find()
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

// Read by id
router.get('/:postId',verifyToken, async(req,res) =>{
    try{
        const getPostById = await Post.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

// Update post
router.patch('/:postId',verifyToken, async(req,res) =>{
    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                postTitle:req.body.postTitle,
                postOwner:req.body.postOwner,
                postDescription:req.body.postDescription
                }
            })
        res.send(updatePostById)
    }catch(err){
        res.send({message:err})
    }
})

// delete post
router.delete('/:postId',verifyToken,async(req,res)=>{
    try{
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router