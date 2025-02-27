const express = require('express')
const { getItems, updateVerifying, updateVerified } = require('../controllers/user.js')

const userRouter = express.Router();

userRouter.get('/', getItems);
userRouter.put('/verify/:email', updateVerifying);
userRouter.put('/verified', updateVerified);

module.exports = userRouter;