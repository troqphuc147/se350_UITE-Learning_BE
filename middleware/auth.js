require("dotenv").config();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = {
  onlyUser: (req, res, next) => {
    try {
      const token = req.headers["procources-access-token"];
      if (!token) return res.status(403).json({ msg: "No token provided." });

      jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) return res.status(500).json({ msg: err });
        req._id = data._id;
        next();
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  onlyAdmin: (req, res, next) => {
    try {
      const token = req.headers["procources-access-token"];
      if (!token) return res.status(403).json({ msg: "No token provided." });

      jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) return res.status(500).json({ msg: err });
        if (data.role === "admin") {
          req._id = data._id;
          next();
        }
        return res.json({ message: "Wrong role" });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = auth;
