const request = require("supertest");
const app = require("../server"); 

// Mock JWT payloads for different roles
const generateToken = (role) => {
    const jwt = require("jsonwebtoken");
    return jwt.sign({ role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Define test tokens for each role
const tokens = {
    superAdmin: generateToken("Super Admin"),
    admin: generateToken("Admin"),
    manager: generateToken("Manager"),
    employee: generateToken("Employee")
};

describe("Role-Based Access Control (RBAC)", () => {
    test("Super Admin: Access /api/tenants → ✅ Allowed", async () => {
        const response = await request(app)
            .get("/api/tenants")
            .set("Authorization", `Bearer ${tokens.superAdmin}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Access granted to tenants");
    });

    test("Admin: Access /api/tenants → ❌ Forbidden", async () => {
        const response = await request(app)
            .get("/api/tenants")
            .set("Authorization", `Bearer ${tokens.admin}`);
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty("message", "Forbidden");
    });

    test("Manager: Access /api/orders → ✅ Allowed", async () => {
        const response = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${tokens.manager}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "Access granted to orders");
    });

    test("Employee: Access /api/orders → ❌ Forbidden", async () => {
        const response = await request(app)
            .get("/api/orders")
            .set("Authorization", `Bearer ${tokens.employee}`);
        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty("message", "Forbidden");
    });
});
