const express = require('express');
const app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server, { cors: { origin: '*' } });
const bodyParser = require('body-parser');
const createError = require('http-errors');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var fileUpload = require('express-fileupload'); // calling express-fileupload here to accept file in the form of multipart data from frontend 

/** -- Import dotenv for environment variables -- */
require('dotenv').config();
/** -- Call Environment Variables -- */
const env  = require('./config');
console.log( env  )
/** -- Set PORT if found otherwise default to 3000 */
const PORT = env.port || 3000;

// -------------------- Importing Routes File ----------------- //
const userView_v1 = require('./routes/userView/v1');
// -------------------- Importing Routes File ----------------- //

// ----------------- Import Model Starts -------------------- //
const Model = require('./models');
// ---------------- Import Model Ends ---------------------- //

/** -- Set limit and the size of the request in application/json -- */
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit:'50mb'}));
/** -- Set limit and the size of the request in application/x-www-form-urlencoded -- */
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true}));
app.use(fileUpload());
// app.use(cors());
/** -- Configuration for Static Files -- */
app.use(express.static(`${__dirname}/public`));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
    next();
});

// --------- connect to mongoDB with mongoose promise Starts --------- //
// mongoUrl : Its a mongodb cloud database url
mongoose.connect(env.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => { 
    // defineRoleInitial();
    // defineSuperAdminInitial();
    console.log('connected to mongo database') 
});
mongoose.connection.on('error', err => { console.log('Error at mongoDB:' + err) });
// --------- connect to mongoDB with mongoose promise Ends ---------- //


app.use('/user/api/v1', userView_v1); // User View API's Url


/** -- IF No Route Found */
app.use((req, res, next) => {
    next(createError(404, 'Route Not found'));
});
  
/** -- Error handler -- */
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if(typeof err.message === 'object'){
        res.send({
            success: false,
            status: err.status || 500,
            ...err.message
        });
    }else{
        res.send({
            success: false,
            status: err.status || 500,
            message: err.message
        });
    }
});  

io.on('connection', socket =>{
    socket.on('JoinUser', async data => {
        const { userId } = data 
        socket.join(userId);
    })

    /************ like post**********/
  socket.on('likePost', async function (data) {
    console.log('data',data)
    if (data && Object.keys(data).length) {

    //   var getPost = await PostService.getOne({ id: data.post_id });
      const getPost = await Model.Post.findOne({ _id: data.postId });
      if (getPost.status) {
        // var user = await userService.getUserOne({ id: getPost.user_id });
        var add, status = true;
        async function getRes() {
            var likeExist = await Model.Like.find(data);
            console.log('likeExist',likeExist)
            if (likeExist && Object.keys(likeExist).length) {
                add = await Model.Like.deleteOne(data);
                status = false;
            } else {
                // data.category_id = postGet.category_id;
                add = await Model.Like.create(data);
                status = true
            }
            const userLike = await Model.Like.find({ postId: data.postId});
            // console.log(userLang.map(lang => lang._id))
            getPost.likes = userLike.map(like => like._id); 

            getPost.save()
        
            data.post = add;
            data.result = await Model.Like.find({ postId: data.postId });
            // data.page = pages;
            data.status = status
            return JSON.stringify(data);
        }
        getRes().then(result => {
          socket.emit('likePost', result);
          socket.broadcast.emit('likePost', result);

        });
      }
    }
  });

})

server.listen( PORT, error => {
    if(error){
        console.log(process.env.NODE_ENV + ' Error On Listening at '+ PORT + ' :: ERROR :: ' + error);
    }else{
        console.log(process.env.NODE_ENV + ' Running At ' + PORT);
    }
});
