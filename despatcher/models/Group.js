const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Group = new Schema({
    _id: String,
    name: String
})

module.exports = mongoose.model('Group', Group);