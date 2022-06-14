const express = require("express");
const router = express.Router();
const discussionController = require('../controllers/discussionController');

router.get('/lesson-quizz/:id', discussionController.getLessonandQuizzByCourseID);
router.get('/user/:id', discussionController.getUserInformation);
router.post('/comment', discussionController.addComment);
router.post('/comment/delete', discussionController.deleteComment);

router.post('/comment/like', discussionController.likeComment);
router.post('/comment/dislike', discussionController.unlikeComment);

router.put('/comment', discussionController.editComment)

router.post('/quizz-passed', discussionController.passTheQuizz);

router.post('/rating', discussionController.ratingCourse);
module.exports = router;    