const multer = require('multer')
const { MAX_FILE_SIZE_IN_MB } = require("../constants");
const MAX_SIZE = MAX_FILE_SIZE_IN_MB * 1024 * 1024;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  __basedir + "/public/uploads/")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    limits: {fieldSize: MAX_SIZE},
})

module.exports = upload