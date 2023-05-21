// ----------------- Import Model Starts -------------------- //
const Model = require('../models');
// ---------------- Import Model Ends ---------------------- //

const check = require('../helpers');

exports.create_post = async ( req, res, next ) => {

    let { filename } = req
    if((req.body.userId && filename && req.body.recordModeSwingId) && (req.body.userId.trim() !== '' && filename.trim() !== '' && req.body.recordModeSwingId.trim() !== '')){
        try {
                        
            let data = {
                userId: (req.body.userId),
                audio: (filename),
                recordModeSwingId: req.body.recordModeSwingId
            }
            
            const postExist = await Model.Post.findOne({ audio: data.audio });
            if(!postExist){
                const newPost = await Model.Post.create(data);
                if(newPost){
                    res.status(200).json({
                        success:true,
                        message:"Post Created Successfully",
                    })
                }else{
                    await Model.Post.findByIdAndDelete(newPost._id)
                    res.status(200).json({
                        success:true,
                        message: 'Due to some technical reason unable to create , please try after some time.'
                    });

                }
                
            }else{
                res.status(400).json({ success: false, message: 'record already in use'});
            }
            
        } catch (error) {
            console.log('error',error)
            res.status(500).json({ success: false, message: 'Something went wrong, please try again later', error});
        }
    }else{
        res.status(400).json({ success: false, message: 'Bad Request, username, email, password, gender is required'});
    }
}

exports.get_posts = async ( req, res ) => {
    try {
        const posts = await Model.Post.find()
                            .populate(
                            [{
                                path:'userId',
                            },
                            {
                                path:'recordModeSwingId',
                            },
                            {
                                path:'likes'
                                // select:'language'
                            }
                            ]
                        ).sort({createdAt: -1}).select('-__v')
        res.status(200).json({ success: true, posts})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error, please try again later', error })
    }
}

exports.delete_post = async (req, res) => {
    try{
        // var now = new Date();     
        // let LastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()-Number(2))
        const count  = await Model.Post.deleteMany();
        // const count1  = await Model.Project.deleteMany();
        // const count2  = await Model.TranslationTask.deleteMany();
        // const count3  = await Model.ProjectLanguage.deleteMany();
        res.status(200).json({ success : true, message: `Activity has been removed from listing `})
        
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server encountered with error',
        })
    }
}