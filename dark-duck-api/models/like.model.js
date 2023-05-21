const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');

const LikeSchema = new Schema({
	likedBy: { type: Schema.ObjectId,ref: 'User' },
    postId: { type: Schema.ObjectId,ref: 'Post' },
    userId: { type: Schema.ObjectId,ref: 'User' }
},{
    strict: true,
},{
    timestamps: true
})

LikeSchema.pre('save', function (next) {
    next();
})

LikeSchema.plugin(timestamps);
LikeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Like', LikeSchema);
module.exports.Schema = LikeSchema;