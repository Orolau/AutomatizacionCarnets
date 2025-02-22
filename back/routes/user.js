const express = require('express')
const { getItems } = require('../controllers/user.js')

const userRouter = express.Router();

userRouter.get('/', getItems);

module.exports = userRouter;