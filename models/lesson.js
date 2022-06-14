const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonCode: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  video: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  lessonVolume: {
    type: Number,
  },
  quizz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quizz",
    },
  ],
  passed: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("lesson", lessonSchema);