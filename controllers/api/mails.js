const Mail = require('../../models/mails')


const controller = {
    list: async function (req, res) {
        await Mail.find({}, 'sender receiver subject details created_at', function (err, mails) {
            if (err) throw err;
            if (mails) {
                res.json(mails)
            }
        })
    },
    toggle: async function (req, res) {
        let mail = await Mail.findById(req.params.id);
        mail[req.params.att] = !mail[req.params.att];
        await mail.save()
        let receivedMails = await Mail.where({ receiver: req.session.activeUser || req.cookies.user })
        let sentMails = await Mail.where({ sender: req.session.activeUser || req.cookies.user })
        
        //this one leaves you in the filter of the category you toggled
        res.redirect(`/inbox/${req.params.att}`) 
        
        // this one doesn't
        // res.render('inbox',
        //     {
        //         logged: req.cookies.user ? true : req.session.activeUser ? true : false,
        //         receivedMails: receivedMails,
        //         sentMails: sentMails
        //     })
    }
}

module.exports = controller