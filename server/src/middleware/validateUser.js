import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]?.trim();

    if (!token) {
        return res.status(403).json({status: 'error', msg: 'Access denied. No token provided.'});
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        res.status(403).json({status: 'error', msg: 'Invalid token.'});
    }
};
