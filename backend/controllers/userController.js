import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// route    GET /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
        const { userName, email, firstName, lastName, password, confirmPassword } = req.body;
        const name = {
            firstName,
            lastName,
        };
        const role = "Patient";
        const newUser = new User({
            userName,
            email,
            name,
            role,
            password
        });
    
        if(password == confirmPassword){
            await newUser.save()
            .then(() => {
                res.status(201).send({ status: "User Added Successfully", user: newUser });
            })
            .catch((error) => {
                console.log(error);
                res.status(500).send({ status: "You already have a account" });
            });
        }else{
            res.status(412).send({ status: "Password miss match" });
        }
        
    });

// @desc    Auth user & set token
// route    POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    try {
        const loguser = await User.findOne({ userName });

        if (!loguser) {
            return res.status(404).send({ status: "User not found" });
        }

        // Await the result of bcrypt.compare
        const comparedpassword = await bcrypt.compare(password, loguser.password);

        if (comparedpassword) {
            const userId = loguser._id;
            const loggertype = { useremail: email, user_id: userId };

            // Generate tokens
            const accessToken = generateAccessToken(loggertype);
            const refreshToken = generateRefreshToken(loggertype);

            // Store the refresh token in the database
            loguser.refreshToken = refreshToken;
            await loguser.save();

            // Return success response with tokens
            res.status(200).send({
                status: "User logged in successfully",
                accessToken,
                refreshToken,
                userId,
                userlogtype
            });
        } else {
            // Password did not match
            res.status(412).send({ status: "User password is incorrect" });
        }
    } catch (error) {
        // Catch any errors and return a server error response
        res.status(500).send({ status: "Error with logging functionality", error: error.message });
    }
});

// @desc    Auth user & set token
// route    POST /api/users/googleAuth
// @access  Public
const googleAuthUser = asyncHandler(async (req, res) => {
    const profile = req.body;

    let user = await User.findOne({ email: profile.email, userType: profile.userType });

    if(user){
        if(user.accType == 'normal'){
            res.status(400);
            throw new Error('User Already Exists! Please login using your password');
        }
        generateToken(res, user.email);
        res.status(200).json({
            _id: user._id,
            email: user.email,  
            image: user.image, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            userType: user.userType,
            phoneNo: user.phoneNo,
            gender: user.gender,
            accType: user.accType,
            totalPayable: user.totalPayable,
            bankAccNo: user.bankAccNo,
            bankAccName: user.bankAccName,
            bankName: user.bankName,
            bankBranch: user.bankBranch,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
    else{
        if(profile.userType == 'occupant'){
            user = await User.create({
                email: profile.email,  
                image: profile.image, 
                firstName: profile.firstName, 
                lastName: profile.lastName, 
                userType: profile.userType,
                phoneNo: profile.phoneNo,
                gender: profile.gender,
                accType: 'google',
                totalPayable: '0'
            })
        }
        else{
            user = await User.create({
                email: profile.email,  
                image: profile.image, 
                firstName: profile.firstName, 
                lastName: profile.lastName, 
                userType: profile.userType,
                phoneNo: profile.phoneNo,
                gender: profile.gender,
                accType: 'google'
            })
        }
        
        if(user){
            generateToken(res, user.email);
            res.status(200).json({
                _id: user._id,
                email: user.email,  
                image: user.image, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                userType: user.userType,
                phoneNo: user.phoneNo,
                gender: user.gender,
                accType: user.accType,
                totalPayable: user.totalPayable,
                bankAccNo: user.bankAccNo,
                bankAccName: user.bankAccName,
                bankName: user.bankName,
                bankBranch: user.bankBranch,
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

    const { email } = req.body;

    await User.findOneAndUpdate({ email }, { $set: { refreshToken: null } })
        .then(() => {
            res.cookie('jwt', '', {
                httpOnly:true,
                expires: new Date(0)
           });
           res.status(200).send({ status: "Logged out successfully" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({ status: "Error with logout functionality" });
        });   
 });


// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: "User not found" });
        }

        res.status(200).send({ status: "User fetched", user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Error with fetching one user data" });
    }
 });


// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const createHealthCard = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email});

    if(user){
        user.nic = req.body.nic || user.nic;
        user.birthDate = req.body.birthDate || user.birthDate;
        user.phoneNo = req.body.phoneNo || user.phoneNo;
        user.occupation = req.body.occupation || user.occupation;
        user.workplace = req.body.workplace || user.workplace;
        user.age = req.body.age || user.age;
        user.maritialStatus = req.body.maritialStatus || user.maritialStatus;
        user.nearestHospital = req.body.nearestHospital || user.nearestHospital;
        user.insuaranceCo = req.body.insuaranceCo || user.insuaranceCo;
        user.insuaranceId = req.body.insuaranceId || user.insuaranceId;
        user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
        user.diabetes = req.body.diabetes || user.diabetes;
        user.bloodPressure = req.body.bloodPressure || user.bloodPressure;
        user.heartTrouble = req.body.heartTrouble || user.heartTrouble;
        user.disorders = req.body.disorders || user.disorders;
        user.strokes = req.body.strokes || user.strokes;
        user.allergies = req.body.allergies || user.allergies;
        user.eyePressure = req.body.eyePressure || user.eyePressure;

        if (req.body.name) {
           user.name.firstName = req.body.address.firstName || user.address.firstName;
           user.name.lastName = req.body.address.lastName || user.address.lastName;
       }
       if (req.body.address) {
           user.address.houseNo = req.body.address.houseNo || user.address.houseNo;
           user.address.city = req.body.address.city || user.address.city;
           user.address.town = req.body.address.town || user.address.town;
       }
        user.password = req.body.password || user.password;

        const updatedUser = await user.save();

        res.status(200).json({updatedUser});
    }else{
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Reset Password
// route    POST /api/users/resetPassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, userType, newPassword } = req.body;

    const user = await User.findOne({ email: email, userType: userType });

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



export { 
    authUser,
    googleAuthUser,
    registerUser, 
    logoutUser,
    getUserProfile,
    resetPassword,
    createHealthCard 
};