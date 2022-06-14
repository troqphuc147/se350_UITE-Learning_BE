const uploadFile = require("../middleware/upload");
const { BASE_API_URL } = require("../constants");

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(200).json({
        success: false,
        message: "Please select a file to upload!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Uploaded the file successfully: ",
      data: {
        url: `${BASE_API_URL}/public/uploads/${req.file.originalname}`,
      },
    });
  } catch (error) {
    console.log("error", error);

    res.status(200).send({
      success: false,
      message: "Failed to upload the file!",
    });
  }
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/public/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(200).send({
        success: false,
        message: "Failed to download the file!",
      });
    }
  });
};

module.exports = {
  upload,
  download,
};
