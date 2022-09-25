let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    post_origin: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model('Comment', CommentSchema);