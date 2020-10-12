const mongoose = require('mongoose');
const { Schema } = mongoose;
const Mail = require('./mails')

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 8
    },
    pass: {
        type: String,
        minlength: 8,
        trim: true
    }
});
userSchema.method({
    login: function (password) { return this.pass == password ? true : false }, // login, returns bool
    sendMail: async function (data, req, res, next) {
        let mail = new Mail(data); // create and save
        mail.save(async function (err) {
            if (err) {
                res.render("404", { logged: req.cookies.user ? true : req.session.activeUser ? true : false, });
                throw err;
            } else {
                let receivedMails = await Mail.where({ receiver: data.sender }).sort({"created_at":-1}).limit(10)
                let sentMails = await Mail.where({ sender: data.sender }).sort({"created_at":-1}).limit(10)
                res.render('inbox', {
                    receivedMails: receivedMails || [],
                    sentMails: sentMails || [],
                    logged: req.cookies.user ? true : req.session.activeUser ? true : false,
                })
            }

        })
    },
    toggleRead: async function (id) {
        let toggledMail = await Mail.findById(id)
        toggledMail.read = !toggledMail.read;
        toggledMail.save();
    },
    toggleFavorite: async function (id) {
        let toggledMail = await Mail.findById(id)
        toggledMail.favorite = !toggledMail.favorite;
        toggledMail.save();
    },
    toggleSpam: async function (id) {
        let toggledMail = await Mail.findById(id)
        toggledMail.spam = !toggledMail.spam;
        toggledMail.save();
    },
    sayName: function (id) {
        return this.email
    },
})
const User = mongoose.model('Users', userSchema)
module.exports = User
