const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Contact = new Schema({
    _id: String,
    firstName: String,
    middleName: String,
    lastName: String,
    email: String,
    phone: String,
    phoneCountryCode: String,
    groups: [String]
})

module.exports = mongoose.model('Contact', Contact);