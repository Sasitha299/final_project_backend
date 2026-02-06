const jwt = require("jsonwebtoken");
const User = require("./auth.model");

class AuthService {
    // Generate JWT token
    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
    }

    // Register new user
    async register(userData) {
        const { username, email, password } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            throw new Error("User already exists with this email or username");
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        };
    }

    // Login user
    async login(credentials) {
        const { email, password } = credentials;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        // Generate token
        const token = this.generateToken(user._id);

        return {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        };
    }
}

module.exports = new AuthService();
