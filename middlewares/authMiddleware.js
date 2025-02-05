const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] || req.cookies.refreshToken;

    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(403).json({ error: "Forbidden: Invalid or expired token" });
    }
};

exports.verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1] || req.cookies.refreshToken;

    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please refresh your token" });
        }
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};
