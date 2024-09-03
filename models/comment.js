const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        content: {
            type: String
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;