const mongoose = require('mongoose');

const Schema = mongoose.Schema;

attachmentSchema = new Schema(
    {
        link: {
            type: String
        },
        tasks: {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    },
    {
        timestamps: true
    }
);

const Attachment = mongoose.model('Attachment', attachmentSchema);
module.exports = Attachment;