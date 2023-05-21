/*

@@--------------------- API routes for Landing Page View--------------------------@@

*/

var express = require('express');
var v1 = express.Router(); // Router-level middleware bound to an instance of express.Router()

// ------------ Import Middlewares Starts Here ----------- //
const verifySignUp = require('../../middlewares/verifySignUp');
const upload = require('../../middlewares/upload');
// ------------ Import Middlewares Ends Here ------------ //

// ------------ Import Controllers Starts Here ----------- //
const authController = require('../../controllers/auth.controller');
const recordModeSwingController = require('../../controllers/recordModeSwing.controller');
const postController = require('../../controllers/post.controller');
// ------------ Import Controllers Ends Here ----------- //

// ------------ Routes Define Starts Here -------------- //

// v1.post('/user/register', [verifySignUp.checkDuplicateEmailUsername], authController.user_register);
v1.post('/user/register', authController.user_register);
v1.post('/user/authenticate', authController.user_login);
v1.post('/user/request-otp', authController.request_otp);
v1.post('/user/verify-otp', authController.verify_otp);
v1.post('/user/reset-password', authController.reset_password);

v1.post('/record-mode-swing', recordModeSwingController.recordMode_create);
v1.get('/record-mode-swing-list', recordModeSwingController.get_records);
v1.patch('/record-mode-swing/:recordModeSwingId',recordModeSwingController.recordMode_update);

v1.get('/countries', authController.all_countries);


v1.post('/post',upload.audioFile,postController.create_post);
v1.get('/posts',postController.get_posts);
v1.get('/delete-posts',  postController.delete_post );

module.exports = v1 // Here router are exports to mount on app in app.js