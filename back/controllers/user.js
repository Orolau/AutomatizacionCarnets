const userModel = require('../models/index.js')

const getItems = async (req, res) => {
    console.log(req);
    const data = await userModel.find();
    res.json(data);
}

module.exports = { getItems }