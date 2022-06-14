const { Router } = require("express");
const { default: mongoose } = require("mongoose");
const cloudinary = require('../cloudinary');
const fs = require('fs');
const upload = require('../multer');
const Course = require("../models/course");
const lesson = require("../models/lesson");
const Quizz = require("../models/quizz");
const router = Router();

router.patch("/update/:lessonId", upload.array('file'), async (req, res) => {
  const lessonId = req.params.lessonId;
  const files = req.files;
  const { name, description, video, cloudId, lessonVolume } = req.body;
  let newVideoUrl = '';
  let newCloudId = '';

  if (files.length > 0) {
    const { path } = files[0]

    const newPath = await cloudinary.uploader.upload(path, {
      resource_type: 'auto',
    }).catch(error => {
      console.log(error)
      res.status(400).json({
        error
      })
      return;
    })
    fs.unlinkSync(path)
    newVideoUrl = newPath.url;
    newCloudId = newPath.public_id;
  }

  lesson.findById(lessonId, async function (err, doc) {
    if (err) {
      //console.log('error here')
      res.status(500).json({ error: "Query err " + err.message });
      return;
    }

    doc.name = name;
    doc.description = description;
    doc.lessonVolume = lessonVolume;

    if (newVideoUrl !== '') {
      doc.video = newVideoUrl;
      doc.cloudId = newCloudId;
      if (cloudId !== '')
        await cloudinary.uploader.destroy(cloudId, function (result) {
          console.log(result);
        })
    }
    
    doc.save()
      .then((result) => {
        res.status(200).send(result);
      }).catch(err => {
        res.status(500).json({ error: "Save err " + err.message});
      })
  })
});

router.delete("/:lessonID", async (req, res) => {
  const lessonID = req.params.lessonID;
  try {
    const existLesson = await lesson.findById(lessonID);

    //Delete quizz of lesson
    const quizzIDs = existLesson.quizz;
    const asyncDeleteQuizz = Quizz.deleteMany({ _id: { $in: quizzIDs } });

    //Delete Lesson in course
    const asyncUpdateLesson = Course.updateOne(
      { lessons: existLesson._id },
      { $pull: { lessons: existLesson._id } }
    );

    await Promise.all([asyncDeleteQuizz, asyncUpdateLesson]);

    //Delete lesson
    await lesson.deleteOne({ _id: existLesson._id });

    res.status(200).json({
      success: true,
      error: false,
      message: "",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: true,
      message: "",
    });
  }
});

module.exports = router;
