const mongoose = require('mongoose');
const Model = {}
Model.mongoose = mongoose
Model.User = require('./user.model');
Model.RecordModeSwing = require('./recordModeSwing.model');
Model.Post = require('./post.model');
Model.Like = require('./like.model');
module.exports = Model // export all models from one place