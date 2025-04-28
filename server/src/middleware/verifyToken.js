import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer '))  {
        token = authHeader.split(' ')[1];
        console.log("Token", authHeader)
    }
    else if (req.query?.token) {
        token = req.query.token;
    }


    if (!token) return res.sendStatus(401);


    jwt.verify(token, 'asdknjafdslfkjda', (err, decoded) => {
        if (err) return res.sendStatus(401);

        req.user = decoded;

        next();
    });
}