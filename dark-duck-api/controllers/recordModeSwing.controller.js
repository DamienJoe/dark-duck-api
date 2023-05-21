// ----------------- Import Model Starts -------------------- //
const Model = require('../models');
// ---------------- Import Model Ends ---------------------- //

const check = require('../helpers');

exports.recordMode_create = async ( req, res, next ) => {
    console.log('req',req.body)
    if((req.body.name) && (req.body.name.trim() !== '')){
        try {
            req.body.name = req.body.name.trim()
            // if(!check.AlphanumeicValidation(req.body.name)){
            //     return res.status(400).json({ success: false, message: 'username, Enter only letters' })
            // }
            
            let data = {
                name: check.capitalizeFirstLetterEachWord(req.body.name),
            }
            
            const recordExist = await Model.RecordModeSwing.findOne({ name: data.name });
            if(!recordExist){
                const newRecord = await Model.RecordModeSwing.create(data);
                if(newRecord){
                    res.status(200).json({
                        success:true,
                        message:"Record Created",
                    })
                }else{
                    await Model.RecordModeSwing.findByIdAndDelete(newRecord._id)
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

exports.get_records = async ( req, res ) => {
    try {
        const records = await Model.RecordModeSwing.find()
                                        .sort({createdAt: -1}).select('-__v')
        res.status(200).json({ success: true, records})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error, please try again later', error })
    }
}

exports.recordMode_update = async ( req, res ) => {
    try {
        const { recordModeSwingId } = req.params;
        let data = {}

        if(req.body.name){
            data.name = req.body.name
        }
        // const records = await Model.RecordModeSwing.find()
        //                                 .sort({createdAt: -1}).select('-__v')
        const user = await Model.RecordModeSwing.findByIdAndUpdate(recordModeSwingId, data, {new : true})
        res.status(200).json({ success: true, message:"updated successfully"})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error, please try again later', error })
    }
}