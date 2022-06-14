const mongoose = require("mongoose");
const Lesson = require("../models/lesson");
const Course = require("../models/course");
const Quizz = require("../models/quizz");
const uploadFile = require("../middleware/upload");
const cloudinary = require("../middleware/cloudinary");
const fs = require("fs");
const { BASE_API_URL } = require("../constants");
const { generateId } = require("../utils/generateId.js")

const getAll = async (req, res) => {
    try {
        const results = await Quizz.find({}).lean();

        return res.status(200).json({
            success: true,
            message: "Get all quizz successfully!",
            data: results,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getByLessonId = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req?.params?.id);
        const result = await Lesson.findOne({
            _id: id,
        });

        if (result) {
            const results = await Quizz.find({
                _id: result.quizz,
            }).lean();

            return res.status(200).json({
                success: true,
                message: "Get all lesson's quizz successfully!",
                data: results,
            });
        } else {
            throw new Error("This lesson does not exist!");
        }
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
        const result = await Quizz.findOne({
            _id: id,
        });

        if (result) {
            return res.status(200).json({
                success: true,
                message: "Get the quizz successfully!",
                data: result,
            });
        } else {
            throw new Error("This quizz does not exist!");
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const create = async (req, res) => {
    const { question, choice, answer } = req.body;
    if (question.length == 0 || choice.length == 0 || answer.length == 0) {
        return res.status(400).json({
            success: false,
            message: "Missing data!",
        });
    }
    try {

        const newItem = new Quizz({
            quizzCode: generateId(7),
            question: question,
            choice: choice,
            answer: answer,
        });
        console.log(newItem)

        const result = await newItem.save();

        if (result) {
            return res.status(200).json({
                success: true,
                message: "Create a new lesson successfully!",
                data : result,
            });
        } else {
            throw new Error("Failed to create a new lesson!");
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// const updateById = async (req, res) => {
//     try {
//         const id = mongoose.Types.ObjectId(req?.params?.id);
//         const result = await Lesson.findOne({
//             _id: id,
//         });

//         if (result) {
//             const { name, description, video, lessonVolume, quizz } = req.body;

//             let errors = {};

//             if (name === "") {
//                 errors["name"] = ["Name is required!"];
//             }

//             if (Object.keys(errors)?.length > 0) {
//                 return res.status(500).json({
//                     success: false,
//                     message: "Failed to update the lesson!",
//                     errors,
//                 });
//             }

//             const result = await Lesson.updateOne(
//                 {
//                     _id: id,
//                 },
//                 {
//                     name,
//                     description,
//                     video,
//                     lessonVolume,
//                     quizz,
//                 }
//             );

//             if (result.modifiedCount === 1) {
//                 return res.status(200).json({
//                     success: true,
//                     message: "Update the lesson successfully!",
//                 });
//             } else {
//                 throw new Error("Failed to update the lesson!");
//             }
//         } else {
//             throw new Error("This lesson does not exist!");
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// const handleUpload = async (files) => {
//     if (files) {
//         const { path } = files[0];
//         const newPath = await cloudinary.uploader
//             .upload(path, {
//                 resource_type: "auto",
//             })
//             .catch((error) => {
//                 throw Error(error.message);
//             });
//         fs.unlinkSync(path);
//         return newPath.url;
//     }
//     return "";
// };

// const updateFieldLesson = async (req, res) => {
//     const lessonId = req.params.id;
//     const thumbnail = req.files.thumbnail;
//     const video = req.files.video;
//     const { name, description } = req.body;
//     // const { path } = video[0]
//     // res.status(200).send({ lessonId, video: path, thumbnail, description, lessonVolume })

//     try {
//         Lesson.findById(lessonId, async function (err, doc) {
//             if (err) {
//                 //console.log('error here')
//                 res.status(500).json({ error: "Query err - " + err.message });
//                 return;
//             }

//             doc.name = name;
//             doc.description = description;

//             //exchange file
//             const thumbnailUrl = await handleUpload(thumbnail);
//             const videoUrl = await handleUpload(video);

//             if (thumbnailUrl !== "") {
//                 doc.thumbnail = thumbnailUrl;
//             }

//             if (videoUrl !== "") {
//                 doc.video = videoUrl;
//             }

//             doc
//                 .save()
//                 .then((result) => {
//                     res.status(200).send(result);
//                 })
//                 .catch((err) => {
//                     res.status(500).json({ error: "Save err - " + err.message });
//                 });
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// const deleteById = async (req, res) => {
//     try {
//         const id = mongoose.Types.ObjectId(req?.params?.id);
//         const result = await Lesson.findOne({
//             _id: id,
//         });

//         if (result) {
//             const deleteResult = await Lesson.deleteOne({
//                 _id: id,
//             });

//             if (deleteResult) {
//                 return res.status(200).json({
//                     success: true,
//                     message: "Delete the lesson successfully!",
//                 });
//             } else {
//                 throw new Error("Failed to delete the lesson!");
//             }
//         } else {
//             throw new Error("This lesson does not exist!");
//         }
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

module.exports = {
    getAll,
    getByLessonId,
    getById,
    create,
    // updateById,
    // updateFieldLesson,
    // deleteById,
};
