const Teacher = require('../models/teacher');

const getAll = async (req, res) => {
    try {
        const teachers = await Teacher.find({}).lean();
    
        return res.status(200).json({
          success: true,
          message: "Get all teachers successfully!",
          data: teachers,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}

module.exports = {
    getAll,
};
