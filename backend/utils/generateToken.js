import jwt from 'jsonwebtoken';

class JWTTokenGenerator {

    //singleton pattern
    constructor() {
        if (JWTTokenGenerator.instance) {
            return JWTTokenGenerator.instance;
        }
        JWTTokenGenerator.instance = this;
    }

    generateToken(res, email) {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { 
            expiresIn: '30d' 
        });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in milliseconds
        });
    }
}

const instance = new JWTTokenGenerator();
Object.freeze(instance);  // Ensure the instance remains immutable

export default instance;
