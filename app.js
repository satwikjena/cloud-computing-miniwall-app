const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')

app.use('/api/user',authRoute)
app.use('/api/posts',postRoute)
app.use('/api/comments',commentRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})

app.listen(3000, ()=>{
console.log('server is running')
})