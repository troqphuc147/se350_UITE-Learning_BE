const util = require("util");
const multer = require("multer");
const { MAX_FILE_SIZE_IN_MB } = require("../constants");
const MAX_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: MAX_SIZE,
  },
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
