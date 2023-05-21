const Model = require('../models');
const ROLES = Model.ROLES;

checkDuplicateEmailUsername = async (req, res, next) => {
    try{
        const checkEmail = await Model.User.findOne({ email: req.body.email })
        if(checkEmail){
            res.status(400).send({ sucess: false, message:'Failed! Email already in use'})
            return;   
        }
        next();
        
    }catch(error){
        console.log("Error--->> ", error)
        res.status(500).send({ success: false, message:'Something goes wrong, try again later', error })
        return;
    }
}

const verifySignUp = {
    checkDuplicateEmailUsername
}

module.exports = verifySignUp;