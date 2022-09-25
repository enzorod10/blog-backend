let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CategorySchema = new Schema({
    category: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post '}]
});

module.exports = mongoose.model('Category', CategorySchema);