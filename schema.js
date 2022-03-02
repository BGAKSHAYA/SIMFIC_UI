var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    Device: String,
    Query: String,
    Result: String,
    Rank: Number
}, {collection:'fiction'});

var FictionModel = mongoose.model('fiction', schema);

module.exports = FictionModel;