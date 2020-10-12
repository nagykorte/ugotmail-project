var express = require('express');
var router = express.Router();
const controller = require('../controllers/index')
const middleware = require('../mw/logged')

// home
router.get('/', controller.index);
// login/out resources
router.get('/login', controller.login);
router.post('/login', controller.checkin);
router.get('/logout',middleware.logged, controller.logout);
// register resources
router.get('/register', controller.register);
router.post('/register', controller.save);
// inbox/mail resources
router.get('/inbox/:sorter?', middleware.logged, controller.inbox);
router.get('/inbox/mail/:mailID',middleware.logged, controller.readMail)
router.post('/mail/send',middleware.logged, controller.sendMail)

module.exports = router;
