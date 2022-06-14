const mongoose = require("mongoose");

const QuizzSchema = new mongoose.Schema({
  quizzCode: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  choice: {
    type: Array,
    required: true,
  },
  answer: {
    type: Array,
    required: true,
  }
});

module.exports = mongoose.model("Quizz", QuizzSchema);
