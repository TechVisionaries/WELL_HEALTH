import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import JWTTokenGenerator from '../utils/generateToken.js';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';
import { sendMail } from '../utils/mailer.js'
import { sendSMS } from '../utils/smsSender.js';

// @desc    Check if user exists and send registeration mail
// route    POST /api/users
// @access  Public
const sendRegisterMail = asyncHandler(async (req, res) => {
    const {
        email, 
        image, 
        firstName, 
        lastName, 
        userType,
        password,
        gender 
    } = req.body;

    var userExists = await User.findOne({ email });

    if(userExists){
        res.status(400);
        throw new Error('User Already Exists');
    }

    var specialization = '';
    var department = '';
    var workPlace = '';

    if(userType == "doctor"){
        specialization = req.body.specialization;
        department = req.body.department;
        workPlace = req.body.workPlace;
    }else if(userType == "manager"){
        department = req.body.department;
        workPlace = req.body.workPlace;
    }


    const user = ({
        email, 
        image, 
        firstName, 
        lastName, 
        password,
        userType,
        specialization,
        department,
        workPlace,
        gender 
    });
    var token = jwt.sign({ user }, process.env.JWT_SECRET, { 
        expiresIn: '1d' 
    });
    token = `${token.split('.')[0]}/${token.split('.')[1]}/${token.split('.')[2]}`;

    if(token){
        const message = `<p><b>Hello ${user.firstName},</b><br><br> 
                            Welcome to WellHealth! Start setting up your account by verifying your email address. Click this secure link:<br><br>
                            <a href="http://${process.env.DOMAIN}/register/${token}">Verify your email</a><br><br>
                            Thank you for choosing WellHealth!<br><br>
                            Best wishes,<br>
                            The WellHealth Hospitals</p>`
        sendMail(email,message,"Activate Your Account");
        res.status(201).json({ message: "Email Verification Sent!"});
    }
    else{
        res.status(400);
        throw new Error('Email not found');
    }
});

// @desc    Register a new user
// route    GET /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    try {
        const {
            email, 
            image, 
            firstName, 
            lastName, 
            password,
            userType,
            specialization,
            department,
            workPlace,
            gender 
        } = jwt.decode(req.query.token).user;
        var userExists = await User.findOne({ email });

        if(userExists){
            res.status(400);
            throw new Error('User Already Exists');
        }
    
        var user;
        if(userType == "patient"){
            user = await User.create({
                email, 
                image, 
                firstName, 
                lastName, 
                password,
                userType,
                gender,
                phoneNo: "",
                healthCard : false, 
                nic : "",
                occupation: "",
                birthday: null,
                age: null,
                address: "",
                workPlace: "",
                martialState: ""
            });
        }else if(userType == "doctor"){
            user = await User.create({
                email, 
                image, 
                firstName, 
                lastName, 
                password,
                userType,
                specialization,
                department,
                workPlace,
                gender,
                phoneNo: "",
                nic : "",
                department: "",
                occupation: "",
                birthday: null,
                age: null,
                address: "",
                workPlace: "",
                martialState: ""
            });
        }
        else{
            user = await User.create({
                email, 
                image, 
                firstName, 
                lastName, 
                password,
                userType,
                gender,
                department,
                workPlace,
                phoneNo: "",
                nic : "",
                department: "",
                occupation: "",
                birthday: null,
                age: null,
                address: "",
                workPlace: "",
                martialState: ""
            });
        }
    
        if(user){
            res.status(201).json({user});
        }else{
            res.status(400);
            throw new Error('Invalid User Data');
        }

    } catch (error) {

        res.status(401);
        throw new Error('Not Authorized, Session Expired');

    }

});


// @desc    Auth user & set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const {email, password } = req.body;

    const user = await User.findOne({ email});

    if(user && user.accType == 'google'){
        res.status(302, 'you already have a google account please log using sigin with google');
        throw new Error('User Found!');
    }
    if(user && (await user.matchPasswords(password))){

        if(user.accType != 'normal'){
            res.status(401);
            throw new Error('Invalid Credentials');
        }

        JWTTokenGenerator.generateToken(res, user.email);
        res.status(200).json({
            _id: user._id,
            email: user.email,  
            image: user.image, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            userType: user.userType,
            phoneNo: user.phoneNo,
            healthCard: user.healthCard,
            gender: user.gender,
            specialization: user.specialization,
            accType: user.accType,
            nic: user.nic,
            department: user.department,
            occupation: user.occupation,
            birthday: user.birthday,
            age: user.age,
            address: user.address,
            workPlace: user.workPlace,
            martialState: user.martialState,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
});
    }else{
        res.status(401);
        throw new Error('User Not Found!');
    }

    // res.status(200).json({ message: 'auth user' });
});


// @desc    Auth user & set token
// route    POST /api/users/googleAuth
// @access  Public
const googleAuthUser = asyncHandler(async (req, res) => {
    const profile = req.body;

    let user = await User.findOne({ email: profile.email });

    if(user){
        if(user.accType == 'normal'){
            res.status(400);
            throw new Error('User Already Exists! Please login using your password');
        }
        JWTTokenGenerator.generateToken(res, user.email);
        res.status(200).json({
            _id: user._id,
            email: user.email,  
            image: user.image, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            userType: user.userType,
            phoneNo: user.phoneNo,
            healthCard: user.healthCard,
            gender: user.gender,
            accType: user.accType,
            nic: user.nic,
            department: user.department,
            occupation: user.occupation,
            birthday: user.birthday,
            age: user.age,
            address: user.address,
            workPlace: user.workPlace,
            martialState: user.martialState,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    else{
            user = await User.create({
                email: profile.email, 
                image: profile.image, 
                firstName: profile.firstName, 
                lastName: profile.lastName, 
                userType: "patient",
                gender: "",
                phoneNo: null,
                accType: 'google',
                nic : "",
                departmet: "",
                occupation: "",
                birthday: null,
                age: null,
                address: "",
                workPlace: "",
                martialState: "" 
            })
        
        if(user){
            JWTTokenGenerator.generateToken(res, user.email);
            res.status(200).json({
                _id: user._id,
                email: user.email,  
                image: user.image, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                userType: user.userType,
                phoneNo: user.phoneNo,
                healthCard: user.healthCard,
                gender: user.gender,
                accType: user.accType,
                nic: user.nic,
                department: user.department,
                occupation: user.occupation,
                birthday: user.birthday,
                age: user.age,
                address: user.address,
                workPlace: user.workPlace,
                martialState: user.martialState,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            });
        }
        else{
            res.status(400);
            throw new Error('Oops, somthing went wrong!');
        }
    }
    
});


// @desc    Logout user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly:true,
        expires: new Date(0)
    })
    
    res.status(200).json({ message: 'Logged out' });
});


// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        email: req.user.email, 
        image: req.user.image, 
        firstName: req.user.firstName, 
        lastName: req.user.lastName, 
        accType: req.user.accType, 
        password: req.user.password, 
        userType: req.user.userType,
        phoneNo: req.user.phoneNo,
        gender: req.user.gender,
        specialization: req.user.specialization,
        healthCard: req.user.healthCard,
        nic: req.user.nic,
        department: req.user.department,
        occupation: req.user.occupation,
        birthday: req.user.birthday,
        age: req.user.age,
        address: req.user.address,
        workPlace: req.user.workPlace,
        martialState: req.user.martialState,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt
    };
    res.status(200).json(user);
});


// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if(user){
        user.image = req.body.image;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phoneNo = req.body.phoneNo || user.phoneNo;
        user.gender = req.body.gender || user.gender;
        user.nic = req.body.nic || user.nic;
        user.occupation = req.body.occupation || user.occupation;
        user.birthday = req.body.birthday || user.birthday;
        user.age = req.body.age || user.age;
        user.address = req.body.address || user.address;
        user.workPlace = req.body.workPlace || user.workPlace;
        user.martialState = req.body.martialState || user.martialState;
        user.password = req.body.password || user.password;

        if(user.userType == 'patient'){
            user.healthCard = req.body.healthCard || user.healthCard;
        }else if(user.userType == 'doctor'){
            user.specialization = req.body.specialization || user.specialization
            user.department = req.body.department || user.department;
        }else{
            user.department = req.body.department || user.department;
        }

        if(req.body.password && req.body.accType == 'normal'){
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            email: updatedUser.email, 
            image: updatedUser.image, 
            firstName: updatedUser.firstName, 
            lastName: updatedUser.lastName, 
            accType: updatedUser.accType, 
            password: updatedUser.password, 
            userType: updatedUser.userType,
            phoneNo: updatedUser.phoneNo,
            gender: updatedUser.gender,
            healthCard: updatedUser.healthCard,
            nic: updatedUser.nic,
            department: updatedUser.department,
            occupation: updatedUser.occupation,
            birthday: updatedUser.birthday,
            age: updatedUser.age,
            address: updatedUser.address,
            workPlace: updatedUser.workPlace,
            martialState: updatedUser.martialState,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});



// @desc    Reset Password
// route    POST /api/users/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email: email });

    if(user){
        user.password = newPassword;
        const updatedUser = await user.save();

        res.status(201).json({ message: "Password Reset Successful!"});
    }
    else{
        res.status(400);
        throw new Error('Opps...Something went wrong!');
    }
});



// @desc    Get All User Details
// route    get /api/users/all-users
// @access  admin
const getAllUsers = asyncHandler(async (req, res) => {
    await User.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with getting data" });
        });
});



// @desc    Remove user profile
// route    delete /api/users/:id
// @access  admin
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        await User.findByIdAndDelete(userId)

        res.status(200).send({ status: "User removed" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with deleting data" });
    }
});




// @desc    Generate OTP
// route    POST /api/users/generateOTP
// @access  Public
const generateOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email, accType:"normal" });
        if(user){
            req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
        
            const message = `<p>Hello ${user.firstName},<br> Your OTP is: <b>${req.app.locals.OTP}</b></p>`

            sendMail(email, message,"Your OTP");
            res.status(201).json({ message: "OTP Sent"});
        }
        else{
            res.status(400);
            throw new Error('Email not found');
        }

});


// @desc    Verify OTP
// route    POST /api/users/verifyOTP
// @access  Public
const verifyOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;
        if(parseInt(req.app.locals.OTP) === parseInt(otp)){
        
        res.status(201).json({ code: req.app.locals.OTP })
        }
        else{
            req.app.locals.OTP = null;
            res.status(400);
            throw new Error("Invalid OTP");
        }

    });


// @desc    Generate SMS OTP
// route    POST /api/users/sms/generateOTP
// @access  public
const generateSMSOTP = asyncHandler(async (req, res) => {
    const { _id, phoneNo } = req.body;

    const user = await User.findOne({ _id });

    req.app.locals.SMSOTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
    
    const message = `Hello ${user.firstName}, Your OTP is: ${req.app.locals.SMSOTP}. Lets verify your phone number!`
    var number = {mobile: parseInt(phoneNo)};
    sendSMS(number, message);
    res.status(201).json({ message: "OTP Sent"});

});


// @desc    Verify OTP
// route    POST /api/users/sms/verifyOTP
//@access   public
const verifySMSOTP = asyncHandler(async (req, res) => {
    const { _id, otp, phoneNo } = req.body;
    if(parseInt(req.app.locals.SMSOTP) === parseInt(otp)){
        
       const user = await User.findOne({ _id });

       user.phoneNo = phoneNo;

       const updatedUser = await user.save();

       res.status(201).json({ 
        _id: updatedUser._id,
        email: updatedUser.email, 
        image: updatedUser.image, 
        firstName: updatedUser.firstName, 
        lastName: updatedUser.lastName, 
        accType: updatedUser.accType, 
        password: updatedUser.password, 
        userType: updatedUser.userType,
        phoneNo: updatedUser.phoneNo,
        gender: updatedUser.gender,
        healthCard: updatedUser.healthCard,
        nic: updatedUser.nic,
        department: updatedUser.department,
        occupation: updatedUser.occupation,
        birthday: updatedUser.birthday,
        age: updatedUser.age,
        address: updatedUser.address,
        workPlace: updatedUser.workPlace,
        martialState: updatedUser.martialState,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
       })
   }
   else{
       req.app.locals.SMSOTP = null;
       res.status(400);
       throw new Error("Invalid OTP");
   }

});

export { 
    authUser,
    googleAuthUser,
    sendRegisterMail,
    registerUser, 
    logoutUser,
    getUserProfile,
    updateUserProfile,
    resetPassword,
    getAllUsers,
    deleteUser,
    generateOTP,
    verifyOTP,
    generateSMSOTP,
    verifySMSOTP
};