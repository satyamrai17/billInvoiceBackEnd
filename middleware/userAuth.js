// const jwt = require('jsonwebtoken');
// const User = require('../model/user');

// const protect = async (req, res, next) => {
//     let token;
//     console.log('req.headers', req.headers);
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded.id).select('-password');
//             next();
//         } catch (error) {
//             console.error(error);
//             res.status(401);
//             throw new Error('Not authorized, token failed');
//         }
//     }

//     if (!token) {
//         res.status(401);
//         throw new Error('Not authorized, no token');
//     }
// };

// module.exports = {
//     protect
// };



const jwt = require('jsonwebtoken');
const User = require('../model/user');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from the token and exclude password
            req.user = await User.findById(decoded.id).select('-password');
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = {
    protect
};