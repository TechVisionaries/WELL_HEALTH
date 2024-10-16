import jwt from 'jsonwebtoken';

const generateToken = (res, email) => {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { 
        expiresIn: '30d' 
    })
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30*24*60*60*1000,
    })

}

export default generateToken;