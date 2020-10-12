const User = require('../models/users')


const middleware = {
    logged: async function (req, res, next) {
        if (!req.cookies.user && ! req.session.activeUser) {
            res.render('login', { logged: req.cookies.user ? true : req.session.activeUser ? true : false, })
        } else {
            next();
        }
    }
}

module.exports = middleware;