var express = require('express');
var router = express.Router();
const controller = require('../controllers/index')
const middleware = require('../mw/logged')

/* GET home page. */
router.get('/', controller.index);
router.get('/login', controller.login);
router.post('/login', controller.checkin);
router.get('/register', controller.register);
router.post('/register', controller.save);
router.get('/inbox/:sorter?', middleware.logged, controller.inbox);
router.get('/logout',middleware.logged, controller.logout);
router.post('/mail/send',middleware.logged, controller.sendMail)

module.exports = router;
