router.get("/users", authMiddleware, rbacMiddleware(["admin", "super_admin"]), async (req, res) => {
    res.json({ message: "List users." });
});


router.get("/users", authMiddleware, tenantMiddleware, async (req, res) => {
    const users = await User.findAll({ where: { tenant_id: req.tenant_id } });
    res.json(users);
});
