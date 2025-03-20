const tenantMiddleware = (req, res, next) => {
    if (!req.user || !req.user.tenant_id) {
        return res.status(403).json({ message: "Unauthorized access: No tenant ID found." });
    }
    req.tenant_id = req.user.tenant_id;
    next();
};

module.exports = tenantMiddleware;
