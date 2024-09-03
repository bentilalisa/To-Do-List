const mongoose = require('mongoose');
const Category = require('./category');
const Attachment = require('./attachment');
const Comment = require('./comment');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            required: true
        },
        status: {
            type: String,
            enum: ['Not Started', 'In Progress', 'Completed'],
            required: true
        },
        assignee: {
            type: String,
            required: true
        },
        category: { 
            type: Schema.Types.ObjectId, 
            ref: 'Category'
        },
        attachments: [{
            type: Schema.Types.ObjectId,
            ref: 'Attachment'
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }]
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;