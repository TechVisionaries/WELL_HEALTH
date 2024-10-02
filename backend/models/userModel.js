import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    nic: {
        type: String, 
        required: true,
        unique : true
    },
    name: {
        firstName: {
            type: String, 
            required: true
        },
        lastName: {
            type: String, 
            required: false
        },
    },
    address: {
        houseNo: {
            type: String,
            required: true,
          },
        city: {
          type: String,
          required: true,
        },
        town: {
          type: String,
          required: true,
        },
    },
    birthDate: {
        type: Date,
        required: true
    },
    phone: {
        type: Number, 
        required: true,
    },
    occupation: {
        type: String, 
        required: true,
    },
    workplace: {
        type: String, 
        required: true,
    },
    userName: {
        type: String, 
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userid: {
        type: String, 
        required: true,
    },
    age: {
        type: Number, 
        required: true,
    },
    maritialStatus: {
        type: String, 
        required: true,
    },
    nearestHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    insuaranceCo: {
        type: String, 
        required: true,
    },
    insuaranceId: {
        type: String, 
        required: true,
    },
    bloodGroup: {
        type: String, 
        required: true,
    },
    diabetes: {
        type: Boolean, 
        required: true,
    },
    bloodPressure: {
        type: Boolean, 
        required: true,
    },
    heartTrouble: {
        type: Boolean, 
        required: true,
    },
    disorders: {
        type: Boolean, 
        required: true,
    },
    strokes: {
        type: Boolean, 
        required: true,
    },
    allergies: {
        type: Boolean, 
        required: true,
    },
    allergyDrugs:{
        type: String,
        required: true,
    },
    eyePressure: {
        type: Boolean, 
        required: true,
    },
    role: {
        type: String, 
        required: true,
    },

    refreshToken : {
        type : String,
        default : null
    },
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

const User = mongoose.model('User', userSchema);

export default User;