const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const generateToken = (user, expiresIn) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
    );
};

// User Registration
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 10) {
            return res.status(400).json({ error: "Password must be at least 10 characters long" });
        }

        if (await User.findOne({ email })) {
            return res.status(400).json({ error: "Email already in use" });
        }

        if (await User.findOne({ username })) {
            return res.status(400).json({ error: "Username already in use" });
        }

        // Assign role (only allow admin to set roles)
        // let assignedRole = "shipper"; 
        // if (role && req.user?.role === "admin") {
        //     assignedRole = role;
        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword, role });

        res.status(201).json({ message: "User registered successfully", user: { username, email, role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const accessToken = generateToken(user, "15m");
        const refreshToken = generateToken(user, "7d"); 

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            accessToken,
            //refreshToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader?.split(" ")[1] || req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ error: "Access Denied. No token provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error retrieving user info" });
    }
};

// Refresh Token
exports.refreshToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ error: "Invalid refresh token" });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(403).json({ error: "User not found" });

        const newAccessToken = generateToken(user, "15m");

        res.status(200).json({
            accessToken: newAccessToken,
        });
    });
};
