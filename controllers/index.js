// imports&functions
const User = require('../models/users')
const Mail = require('../models/mails')
const handleError = function (err) {
    console.error(err);
};
const bcrypt = require('bcrypt');
const salt = 10;

//////////////////
////  module  ////
//////////////////

const controller = {
    // GET /
    index: async function (req, res, next) {
        req.session.activeUser = req.cookies.user
        res.render('index', {
            title: 'Ugot Mail',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    // GET /login
    login: function (req, res, next) {
        res.render('login', {
            title: 'title',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    // POST /login
    checkin: async function (req, res, next) {
        if (req.cookies.user) { res.clearCookie('user'); }
        if (req.session.activeUser) { req.session.destroy(); }
        let user = await User.findOne({ email: req.body.email })
        if (user.email == req.body.email) {
            if (user.login(req.body.pass)) {
                if (req.body.checkbox) {
                    res.cookie('user', user.email, { maxAge: 24 * 3600000 }) //in hours, a day rn
                }
                req.session.activeUser = user.email
                let receivedMails = await Mail.where({ receiver: user.email })
                let sentMails = await Mail.where({ sender: user.email })
                res.render('inbox', {
                    receivedMails: receivedMails,
                    sentMails: sentMails,
                    logged: req.cookies.user ? true : req.session.activeUser ? true : false,
                })
            }
        }
        if (!req.cookies.user && !req.session.activeUser) {
            res.render("login",
                { logged: req.cookies.user ? true : req.session.activeUser ? true : false })
        }
    },
    // GET /register
    register: function (req, res, next) {
        res.render('register', {
            title: 'Register',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    // POST /register
    save: async function (req, res, next) {
        let hashedPassword = bcrypt.hashSync(req.body.pass,salt);
        let newUser = new User({ email: req.body.email, pass: hashedPassword })
        newUser.save(function (err) {
            console.log(err);
            if (err) return handleError(err);
            res.render('login', {
                logged: req.cookies.user ? true : req.session.activeUser ? true : false,
            })
        });
    },
    // GET /inbox/:sorter?
    inbox: async function (req, res, next) {
        let user = req.cookies.user || req.session.activeUser;
        if (req.params.sorter) {
            switch (req.params.sorter) {
                case ("read"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: false, read: true }).sort({ "created_at": -1 }).limit(10); break;
                case ("unread"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: false, read: false }).sort({ "created_at": -1 }).limit(10); break;
                case ("favorite"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: false, favorite: true }).sort({ "created_at": -1 }).limit(10); break;
                case ("spam"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: false, spam: true }).sort({ "created_at": -1 }).limit(10); break;
                case ("deleted"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: true }).sort({ "created_at": -1 }).limit(10); break;
                default:
                    var receivedMails = await Mail.find({ receiver: user, deleted: false }).sort({ "created_at": -1 }).limit(10)
            }
        } else {
            var receivedMails = await Mail.where({ receiver: user, deleted: false }).sort({ "created_at": -1 }).limit(10)
        }
        let sentMails = await Mail.where({ sender: user })
        res.render('inbox', {
            receivedMails: receivedMails,
            sentMails: sentMails,
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        })
    },
    // POST /send/mail
    sendMail: async function (req, res, next) {
        let email = req.cookies.user || req.session.activeUser;
        // arranges receivers neatly
        let receiverArray = req.body.recipientString.split(",")
        receiverArray.forEach((rec, index) => { receiverArray[index] = rec.trim() });
        // loads user
        const thisUser = await User.findOne({ email: email });
        // makes object
        let mail = {
            sender: email,
            receiver: receiverArray,
            subject: req.body.title || '',
            details: req.body.message
        }
        // sends
        thisUser ? thisUser.sendMail(mail, req, res, next) : res.render('index', {
            title: 'Ugot Mail',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    // GET /logout
    logout: function (req, res) {
        if (req.cookies.user) { res.clearCookie('user'); };
        if (req.session.activeUser) { req.session.destroy(); }
        res.render('index', { title: 'Ugot Mail', logged: false })
    },
    readMail: async function (req, res, next) {
        // fetch email
        let mail = await Mail.findById(req.params.mailID);
        console.log(mail);
        // check with user & render page with email
        if ((typeof mail.receiver) == 'string') {
            console.log('got to string!');
            if (mail.receiver == (req.session.activeUser || req.cookies.user)) {
                res.render('inboxReader', {
                    mail: mail,
                    logged: req.cookies.user ? true : req.session.activeUser ? true : false,
                })
            }
        } else {
            console.log('not a string?');
            if ((typeof mail.receiver) == 'object') {
                for (let i = 0; i < mail.receiver.length; i++) {
                    if (mail.receiver[i] == (req.session.activeUser || req.cookies.user)) {
                        res.render('inboxReader', {
                            mail: mail,
                            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
                        })
                        break;
                    }
                }
            } else {
                res.send('invalid data')
            }
        }
    }
};

module.exports = controller