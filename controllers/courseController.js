const mongoose = require("mongoose");
const Course = require("../models/course");
const Teacher = require("../models/teacher");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");

const getAll = async (req, res) => {
  try {
    const results = await Course.find({})
      .lean()
      .populate("lessons")
      .populate("teacher");

    return res.status(200).json({
      success: true,
      message: "Get all courses successfully!",
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req?.params?.id);
    const result = await Course.findOne({
      _id: id,
    })
      .populate("lessons")
      .populate("teacher");

    if (result) {
      return res.status(200).json({
        success: true,
        message: "Get the course's details successfully!",
        data: result,
      });
    } else {
      throw new Error("This course does not exist!");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { courseName, courseImage, description, lessons } = req.body;
    let errors = {};

    if (courseName === "") {
      errors["courseName"] = ["Course name is required!"];
    }

    if (courseImage === "") {
      errors["courseImage"] = ["Course image is required!"];
    }

    if (description === "") {
      errors["description"] = ["Description is required!"];
    }

    if (Object.keys(errors)?.length > 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to create a new course!",
        errors,
      });
    }

    const newItem = new Course({
      courseName,
      courseImage,
      description,
      lessons,
    });

    const result = await newItem.save();

    if (result) {
      return res.status(201).json({
        success: true,
        message: "Create a new course successfully!",
        data: result,
      });
    } else {
      throw new Error("Failed to create a new course!");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const thumbnail = req.files.thumbnail;
    const video = req.files.video;
    const { courseName, description, teacherId } = req.body;

    const teacher = await Teacher.find({}).limit(1).lean();
    const lastCourse = await Course.find({}).sort({ _id: -1 }).limit(1).lean();

    const courseCodeIndex = lastCourse[0].courseCode.substring(6); //COURSE1 => 1

    let course = await Course.create({
      courseName,
      description,

      teacher: teacher[0]._id,
      courseCode: `COURSE${Number(courseCodeIndex) + 1}`,
    });

    const courseImage = await handleUpload(thumbnail);
    const demoVideo = await handleUpload(video);
    course.courseImage = courseImage;
    course.demoVideo = demoVideo;

    course.save().then((result) => {
      res.status(200).json({
        success: true,
        course: result,
        message: "Course created!",
      });
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create the course!" });
  }
};

const updateById = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req?.params?.id);
    const result = await Course.findOne({
      _id: id,
    });

    if (result) {
      const { courseName, courseImage, description, lessons, isActive } = req.body;

      let errors = {};

      if (courseName === "") {
        errors["courseName"] = ["Course name is required!"];
      }

      if (courseImage === "") {
        errors["courseImage"] = ["Course image is required!"];
      }

      if (description === "") {
        errors["description"] = ["Description is required!"];
      }

      if (Object.keys(errors)?.length > 0) {
        return res.status(500).json({
          success: false,
          message: "Failed to update the course!",
          errors,
        });
      }

      const result = await Course.updateOne(
        {
          _id: id,
        },
        {
          courseName,
          courseImage,
          description,
          lessons,
          isActive
        }
      );

      if (result.modifiedCount === 1) {
        return res.status(200).json({
          success: true,
          message: "Update the course successfully!",
        });
      } else {
        throw new Error("Failed to update the course!");
      }
    } else {
      throw new Error("This course does not exist!");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req?.params?.id);
    const result = await Course.findOne({
      _id: id,
    });

    if (result) {
      const deleteResult = await Course.deleteOne({
        _id: id,
      });

      if (deleteResult) {
        return res.status(200).json({
          success: true,
          message: "Delete the course successfully!",
        });
      } else {
        throw new Error("Failed to delete the course!");
      }
    } else {
      throw new Error("This course does not exist!");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const handleUpload = async (files) => {
  if (files) {
    const { path } = files[0];
    const newPath = await cloudinary.uploader
      .upload(path, {
        resource_type: "auto",
      })
      .catch((error) => {
        throw Error(error.message);
      });
    fs.unlinkSync(path);
    return newPath.url;
  }
  return "";
};

const updateFieldCourse = async (req, res) => {
  try {
    const courseID = req.params.id;
    const courseImage = req.files.thumbnail;
    const demoVideo = req.files.video;
    const { courseName, category, description, teacher } = req.body;
    const course = await Course.findById(courseID);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "This course does not exists" });

    if (courseName) course.courseName = courseName;
    course.description = description || "";
    if (teacher) {
      const existTeacher = await Teacher.findById(teacher);
      if (!existTeacher)
        return res
          .status(404)
          .json({ success: false, message: "This teacher does not exists!" });
      else course.teacher = existTeacher._id;
    }

    const thumbnailUrl = await handleUpload(courseImage);
    const videoUrl = await handleUpload(demoVideo);

    if (thumbnailUrl !== "") {
      course.courseImage = thumbnailUrl;
    }

    if (videoUrl !== "") {
      course.demoVideo = videoUrl;
    }

    const savedCourse = await course.save();
    res.status(200).json({
      success: true,
      course: savedCourse,
      message: "Update the course successfully!",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update the course!" });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  createCourse,
  updateById,
  deleteById,
  updateFieldCourse,
};
