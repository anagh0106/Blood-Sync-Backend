const jwt = require('jsonwebtoken');
const secret = "Galu_0106";

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ message: "Authorization header is missing or invalid." });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No Token, Access Denied." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secret);
        req.superAdmin = decoded; // Attach decoded data to the request object
        console.log("Decoded Token:", req.superAdmin);
        next(); // Proceed to the next middleware/route
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid Token." });
    }
};

module.exports = {
    verifyToken,
};
