const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  // },
  courseCode: {
    type: String,
    unique: true,
  },
  courseName: {
    type: String,
    required: true,
    unique: true,
  },
  courseImage: {
    type: String,
  },
  demoVideo: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
    // required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lesson",
    },
  ],
  discussion: [],
  rating: [],
  isActive: {
    type: Boolean,
    default: true,
  }
});

module.exports = mongoose.model("Course", courseSchema);
