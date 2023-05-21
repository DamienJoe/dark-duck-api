const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');

const PostSchema = new Schema({
	userId: { type: Schema.ObjectId,ref: 'User' },
	audio: { type:String, trim: true, default: null },
	recordModeSwingId: { type: Schema.ObjectId,ref: 'RecordModeSwing' },
    status: { type: Boolean, default: true, enum :[ false, true ]},
    likes: [{ type: Schema.ObjectId, ref: 'Like' }]
},{
    strict: true,
},{
    timestamps: true
})

PostSchema.pre('save', function (next) {
    next();
})

PostSchema.plugin(timestamps);
PostSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Post', PostSchema);
module.exports.Schema = PostSchema;