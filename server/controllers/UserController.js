const User = require("../models/UserModel");
const HttpError = require("../models/ErrorModel");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
//======== REgister New User
//POST Url: api/users/register 


const registerUser = async (req,res,next) => {
    
    try {
        const {name, email, password, cpassword} = req.body;
        if(!name || !email || !password){
            return next(new HttpError("Fill In All Fields.", 422))
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({email:newEmail})
        if(emailExists){
            return next(new HttpError("Email Already Exists.", 422));
        }

        if((password.trim()).length < 6 ){
            return next(new HttpError("Password Should be greater than 6 characters", 422));
        }

        if(password!= cpassword){
            return next(new HttpError("Passwords do not match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassw = await bcrypt.hash(password, salt)
        const newUser = await User.create({name, email: newEmail,password:hashPassw});
        res.status(201).json(`newUser ${newUser.email} registerd.`);


    } catch (error) {
        return next(new HttpError("User Registration Failed.", 422));
    }
}





//======== Login Registerd User
//POST Url: api/users/login 

const loginUser = async(req,res,next) => {
    try {
        
        const {email, password} = req.body;
        if(!email || !password)
        {
            return next(new HttpError("Fill in all Fields", 422));
        }
        
        const newEmail = email.toLowerCase();

        const user = await User.findOne({email:newEmail});
        if(!user){
            return next(new HttpError("Invalid Credentials", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if(!comparePass){
            return next(new HttpError("Invalid Password", 422));
        }

        const {_id: id, name} = user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRETE, {expiresIn:"id"})

        res.status(200).json({token, id , name});

    } catch (error) {
        return next(new HttpError("Login Failed. Please check the credentials", 422));
    }
}




//======== User Profile
//POST Url: api/users/:id

const getUser = async(req,res,next) => {
    
    try {
        
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if(!user)
        {
            return next(new HttpError("User not found", 404));
        }

        res.status(200).json(user)

    } catch (error) {
        return next(new HttpError(error));
    }
}




//======== User Profile
//POST Url: api/users/change-avatar 

const changeAvatar = async(req,res,next) => {
    
    try {
        
        if(!req.files.avatar){
            return next(new HttpError("Please choose an image", 422));
        }
        

    } catch (error) {
        return next(new HttpError(error));
    }
}






//======== Change user Avatar from profile
//POST Url: api/users/:id 

const editUser = async(req,res,next) => {
    res.json("Edit User Details");
}






//======== Get Authors
//POST Url: api/users/authors 

const getAuthors = async (req,res,next) => {
    try {
        
        const authors = await User.find().select('-password');
        res.json(authors);

    } catch (error) {
        return next(new HttpError(error));
    }
}


module.exports = {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors}



