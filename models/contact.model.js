const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ContactModelSchema = new Schema({
    title: {type: String, default: ''},
    content: {type: String, default: ''},
    userid: {type: String, default: ''},
    name: {type: String, default: ''},
    email: {type: String, default: ''},
    permission: { type: Number, default: 0 },
    phoneNumber: {type: String, default: ''},
});

module.exports = mongoose.model('contact', ContactModelSchema);