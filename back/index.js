const express = require('express')
const cors = require('cors')
require('dotenv').config()
const userRouter = require('./routes/user.js')
//const { dbConnect, getDB } = require("./config/database");
const dbConnect = require('./config/database.js')


const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', userRouter)

dbConnect();
