const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
});

const Comments = mongoose.model('Comments', CommentSchema);

module.exports = Comments;
