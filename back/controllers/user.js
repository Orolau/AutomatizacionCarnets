const {userModel} = require('../models/index.js')

const getItems = async (req, res) => {
    const data = await userModel.find({});
    console.log(data)
    res.send({data});
}

module.exports = { getItems }