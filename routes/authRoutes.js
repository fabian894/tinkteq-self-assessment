const express = require("express");
const { register, login, refreshToken, getUserInfo } = require("../controllers/authController");
const { checkRole } = require("../middlewares/checkRole");
const { verifyToken } = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected Routes with Role-Based Access Control (RBAC)
router.get("/protected", verifyToken, (req, res) => {
    res.json({ message: "This is a protected route!", user: req.user });
});

router.get("/user/:id", verifyToken, checkRole(["admin", "shipper", "carrier"]), getUserInfo); 

router.get("/admin/dashboard", verifyToken, checkRole(["admin"]), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

router.post("/shipments", verifyToken, checkRole(["shipper"]), (req, res) => {
    res.json({ message: "Shipment created successfully" });
});


router.post("/accept-shipment", verifyToken, checkRole(["carrier"]), (req, res) => {
    res.json({ message: "Shipment accepted" });
});

module.exports = router;
