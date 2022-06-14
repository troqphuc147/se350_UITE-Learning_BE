const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const quizzController = require("../controllers/quizzController");

router.get("/", quizzController.getAll);
router.get("/:id", quizzController.getById);
router.get("/lesson/:id", quizzController.getByLessonId);
router.post("/", quizzController.create);
// router.put("/:id", lessonController.updateById);
// router.patch(
//     "/:id",
//     upload.fields([
//         { name: "thumbnail", maxCount: 1 },
//         { name: "video", maxCount: 1 },
//     ]),
//     lessonController.updateFieldLesson
// );
// router.delete("/:id", lessonController.deleteById);

module.exports = router;
