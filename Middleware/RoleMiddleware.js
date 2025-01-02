// RoleMiddleware.js
module.exports.RBAC = (...roles) => {
    return (req, res, next) => {
        try {

            if (roles.includes(req.user.role)) {
                return res.status(403).json({ error: "Access denied" });
            }
            next(); // Call next to proceed
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };
};
