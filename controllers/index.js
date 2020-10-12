// imports&functions
const User = require('../models/users')
const Mail = require('../models/mails')
const handleError = function (err) {
    console.error(err);
};

// module itself
const controller = {
    index: async function (req, res, next) {
        req.session.activeUser = req.cookies.user
        res.render('index', {
            title: 'Ugot Mail',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    login: function (req, res, next) {
        res.render('login', {
            title: 'title',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
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
    register: function (req, res, next) {
        res.render('register', {
            title: 'Register',
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        });
    },
    save: async function (req, res, next) {
        let newUser = new User({ email: req.body.email, pass: req.body.pass })
        newUser.save(function (err) {
            console.log(err);
            if (err) return handleError(err);
            res.render('login', {
                logged: req.cookies.user ? true : req.session.activeUser ? true : false,
            })
        });
    },
    inbox: async function (req, res, next) {
        let user = req.cookies.user || req.session.activeUser;
        if (req.params.sorter) {
            switch (req.params.sorter) {
                case ("read"):
                    console.log('read');
                    var receivedMails = await Mail.where({ receiver: user, read: true })
                    break;
                case ("unread"):
                    var receivedMails = await Mail.where({ receiver: user, read: false })
                    console.log('unread');
                    break;
                case ("favorite"):
                    var receivedMails = await Mail.where({ receiver: user, favorite: true })
                    console.log('favorite');
                    break;
                case ("spam"):
                    var receivedMails = await Mail.where({ receiver: user, spam: true })
                    console.log('spam');
                    break;
                case ("deleted"):
                    var receivedMails = await Mail.where({ receiver: user, deleted: true })
                    console.log('deleted');
                    break;
                default:
                    var receivedMails = await Mail.where({ receiver: user })
                    console.log('git gud');
            }
        } else {
            var receivedMails = await Mail.where({ receiver: user })
        }
        let sentMails = await Mail.where({ sender: user })
        res.render('inbox', {
            receivedMails: receivedMails,
            sentMails: sentMails,
            logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        })
    },
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
    logout: function (req, res) {
        if (req.cookies.user) { res.clearCookie('user'); };
        if (req.session.activeUser) { req.session.destroy(); }
        res.render('index', { title: 'Ugot Mail', logged: false })
    },
}


module.exports = controller