const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; // Extract the Authorization header

    // Check if the Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key"); // Replace "secret_key" with your actual environment variable for security
        req.user = decoded; // Attach the decoded user data (e.g., user ID, role) to the request object for further use
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle token verification errors
        return res.status(401).json({ message: "Access denied. Invalid token." });
    }
};

module.exports = authMiddleware;
