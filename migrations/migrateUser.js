require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 50000 })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Function to insert a test user
const migrate = async () => {
    try {
        const existingUser = await User.findOne({ email: "test@example.com" });
        if (existingUser) {
            console.log("⚠️ Test user already exists. Skipping migration.");
        } else {
            await User.create({
                username: "testuser",
                email: "test@example.com",
                password: "hashedpassword123"
            });
            console.log("✅ User migration successful!");
        }
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        mongoose.disconnect();
    }
};

migrate();
