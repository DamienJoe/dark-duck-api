const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');

const RecordModeSwingSchema = new Schema({
    name: { type: String, trim: true, required: true }
},{
    strict: true,
},{
    timestamps: true
})

RecordModeSwingSchema.pre('save', function (next) {
    next();
})

RecordModeSwingSchema.plugin(timestamps);
RecordModeSwingSchema.plugin(uniqueValidator);
module.exports = mongoose.model('RecordModeSwing', RecordModeSwingSchema);
module.exports.Schema = RecordModeSwingSchema;