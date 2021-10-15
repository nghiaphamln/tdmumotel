const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var MotelModelSchema = new Schema({
    title: {type: String},
    description: {type: String},
    streetName: {type: String},
    wards: {type: String},
    district: {type: String},
    cost: {type: Number, default: 0},
    water: {type: Number, default: 0},
    electric: {type: Number, default: 0},
    roomType: {type: Number, default: 0},
    ultilities: {type: String, default: ''},
    uploadImage: {type: String, default: ''},
    time: {type: Date, default: Date.now},
    status: {type: Number, default: 0}
});

module.exports = mongoose.model('motel', MotelModelSchema);