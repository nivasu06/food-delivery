import jwt from 'jsonwebtoken';

// Middleware to handle JWT authentication
const jwtAuth = (req, res, next) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
        return res.status(401).render('login', { errorMessage: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(401).render('login', { errorMessage: 'Unauthorized' });
    }
};

export default jwtAuth;
