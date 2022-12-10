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

    const user = await User.findById(req.user._id)
    

    const postData = new Post({
        postTitle:req.body.postTitle,
        postOwner:user['email'],
        postDescription:req.body.postDescription,
        like:0
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
        const posts = await Post.find().sort({ like: -1, timeStamp: -1})
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/individualPost', verifyToken, async(req,res) =>{
    const user = await User.findById(req.user._id)
    try{
        const posts = await Post.find({postOwner:user['email']})
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/like/:postId', verifyToken, async(req,res) =>{

    const postExists = await Post.findById(req.params.postId)
    if(!postExists){
        return res.status(400).send({message:'Post doesnot exist, provide a valid post'})
    }

    const user = await User.findById(req.user._id)
    const postOwnerEqualsLikeOwner = postExists['postOwner'] === user['email']
    if(postOwnerEqualsLikeOwner){
        return res.status(400).send({message:'Post Owner canot like his own post'})
    }

    try{
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                like:postExists['like'] +1
                }
            })
        res.send(updatePostById)
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
    const user = await User.findById(req.user._id)
    const postExists = await Post.findById(req.params.postId)
    if(!postExists){
        return res.status(400).send({message:'Post doesnot exist, provide a valid post'})
    }
    const postOwnerNotEqualsUser = postExists['postOwner'] !== user['email']
    if(postOwnerNotEqualsUser){
        return res.status(400).send({message:'Post Owner can only update his post'})
    }
        const updatePostById = await Post.updateOne(
            {_id:req.params.postId},
            {$set:{
                postTitle:req.body.postTitle,
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

    const user = await User.findById(req.user._id)
    const postExists = await Post.findById(req.params.postId)
    if(!postExists){
        return res.status(400).send({message:'Post doesnot exist, provide a valid post'})
    }
    const postOwnerNotEqualsUser = postExists['postOwner'] !== user['email']
    if(postOwnerNotEqualsUser){
        return res.status(400).send({message:'Post Owner can only delete his post'})
    }

    try{
        const deletePostById = await Post.deleteOne({_id:req.params.postId})
        res.send(deletePostById)
    }catch(err){
        res.send({message:err})
    }
})

module.exports = router