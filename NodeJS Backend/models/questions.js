const mongoose = require('mongoose');


const QuestionSchema = mongoose.Schema({
        adminId : String,
        columns : Array,
        questionName : String,
});

module.exports = mongoose.model('Questions' , QuestionSchema);