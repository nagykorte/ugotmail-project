var express = require('express');
var router = express.Router();
const mailController = require('../../controllers/api/mails')

/* GET home page. */
router.get('/list', mailController.list);
router.get('/toggle/:id/:att', mailController.toggle);

module.exports = router;
