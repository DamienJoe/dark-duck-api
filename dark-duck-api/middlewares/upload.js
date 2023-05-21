// const config = require('../config');
const env  = require('../config');

function getFileExtension(filename){
    if (filename.length == 0) return "";
    var dot = filename.lastIndexOf(".");
    if (dot == -1) return "";
    var extension = filename.substr(dot, filename.length);
    return extension;
};

audioFile = (req, res, next)=>{
    try{
        console.log('req',req.files)
        var file = req.files.audio;
        // let fileType = getFileExtension(file.name);
        var fileName = Date.now() + Math.floor(1000 + Math.random() * 9000) + ".mp3";
        file.mv(`${env.dirPath + 'audio/' + fileName}`, (err) => {
            if (err){
                return res.status(500).json({ success:false, message:"Failed to upload file, please try after some time ", error:err })
            }else{
                // req.fileextension = fileType
                req.filename = fileName
                req.filedata = file.data
                next();
            }
        })
    }catch(error){
        console.log(error)
        res.status(500).json({ success:false, message:"Failed to upload file, please try again ", error:error })
    }
}

const upload = {
    audioFile
}

module.exports = upload