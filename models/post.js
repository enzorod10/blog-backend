let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new Schema({
    title: { type: String, required: true },
    content: [{ sectionTitle: String, body: [Object] }],
    summary: { type: String, required: true },
    timestamp: { type: String, required: true },
    published_status: { type: Boolean },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    category: { type: Schema.Types.ObjectId, ref:'Category'}
});

PostSchema.virtual('url')
.get(function() {
    return '/post/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);