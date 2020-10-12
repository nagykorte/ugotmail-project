const mongoose = require('mongoose');
const { Schema } = mongoose;

const mailSchema = new Schema({
    sender: {
        type: String,
        unique: false
    },
    receiver: [String],
    details: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        default: 'untitled',
        required: false
    },
    read: {
        type: Boolean,
        default: false,
        required: false
    },
    spam: {
        type: Boolean,
        default: false,
        required: false
    },
    favorite: {
        type: Boolean,
        default: false,
        required: false
    },
    deleted: {
        type: Boolean,
        default: false,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
});
mailSchema.method({})
const Mail = mongoose.model('Mails', mailSchema)
module.exports = Mail
