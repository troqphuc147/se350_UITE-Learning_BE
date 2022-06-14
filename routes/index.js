const usersRouter = require("./users");
const lessonsRouter = require("./lessons");
const coursesRouter = require("./courses");
const filesRouter = require("./files");
const quizzRouter = require("./quizz");
const discussionRouter = require("./discussion");
const googleRouter = require('./google');
const teacherRouter = require('./teachers')

function router(app) {
  app.use("/api/users", usersRouter);
  app.use("/api/lessons", lessonsRouter);
  app.use("/api/courses", coursesRouter);
  app.use("/api/files", filesRouter);
  app.use("/api/quizz", quizzRouter);
  app.use("/api/discussions", discussionRouter);
  app.use('/auth/google', googleRouter);
  app.use("/api/teachers", teacherRouter)
  app.use("/api/quizz", quizzRouter);
}

module.exports = router;
