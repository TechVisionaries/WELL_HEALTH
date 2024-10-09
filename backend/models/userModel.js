import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    image: {
        type: String, 
        required: false
    },
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String, 
        required: false
    },
    phoneNo: {
        type: String
    },
    gender: {
        type: String
    },
    accType: {
        type: String, 
        required: true,
        default: 'normal'
    },
    userType: {
        type: String, 
        required: true,
        default: 'patient'
    },
    healthCard: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String
    },
    nic: {
        type: String,
    },
    department: {
        type: String,
    },
    occupation: {
        type: String,
    },
    birthday: {
        type: Date
    },
    age: {
        type: Number
    },
    address: {
        type: String
    },
    workPlace: {
        type: String
    },
    martialState: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }

    if(!this.password){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User