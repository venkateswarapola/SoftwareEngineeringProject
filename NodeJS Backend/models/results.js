const mongoose = require('mongoose');


const AnswerSchema = mongoose.Schema({
        userId : String,
        answers : Array,
        questionName : String,
});

module.exports = mongoose.model('Answers' , AnswerSchema);