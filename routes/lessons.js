const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const lessonController = require("../controllers/lessonController");

router.get("/", lessonController.getAll);
router.get("/:id", lessonController.getById);
router.get("/courses/:id", lessonController.getByCourseId);
router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  lessonController.create
);
router.post(
  "/add/quizz",
  lessonController.addQuizToLesson
);
router.put("/:id", lessonController.updateById);
router.patch(
  "/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  lessonController.updateFieldLesson
);
router.delete("/:id", lessonController.deleteById);

module.exports = router;
