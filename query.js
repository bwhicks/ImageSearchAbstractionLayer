var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    var QuerySchema = new Schema({
        search: String,
        date: String
    });
mongoose.model('Query', QuerySchema)
};