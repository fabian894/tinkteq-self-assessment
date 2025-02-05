exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ error: "Forbidden: No role assigned" });
        }

        console.log("User Role:", req.user.role); 

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: You do not have permission" });
        }

        next();
    };
};
