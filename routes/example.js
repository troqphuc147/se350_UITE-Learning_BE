
const express = require('express');
const router = express.Router();

const ExampleController = require('../controllers/example');
// router.<method>('domain', middlewareFunction nếu có, controllerFunction)
router.get('/get-example',ExampleController.exampleFunction)
//=>  <Domain>/api/example/get-email-example || sẽ vào ExampleController.example để xử lý logic và trả về api cho client

// router.post()
// router.delete()
// router.put()

module.exports = router;