    import jwt from 'jsonwebtoken';

    export const verifyUser = async (req, res, next) => {
    
        const authHeader = req.headers.authorization;

        const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;


        if (!accessToken) {
            return res.json({ message: "Token not available" });
            
        } else {
            const loggedInAccessToken = req.cookies.accessToken;

        if (accessToken !== loggedInAccessToken) {
            return res.status(403).json({ message: "mismatched token" });
        }
            jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
            
                if (err) {

                    return renewToken(req, res, next);
                } else {
                    req.user = { id: decoded.userId, email: decoded.email };
                    next();
                }
            });
        }
    };

    export const renewToken = async (req, res, next) => {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.json({ message: "Refresh Token Not Available" });
        } else {
            jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.json({ message: "Invalid Refresh Token" });
                } else {
                    const newAccessToken = jwt.sign({  userId: decoded.userId,email: decoded.email }, process.env.ACCESS_SECRET_KEY, { expiresIn: '30m' });
                    
                
                    res.cookie('accessToken', newAccessToken, { maxAge: 30*60*1000 });

                    
                    req.email = decoded.email; 
                    next();
                }
            });
        }
    };
