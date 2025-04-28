import users from '../data/users.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'asdknjafdslfkjda';

export const getUserProfile = (req, res) => {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ status: "error", msg: "Invalid user ID." });
    }

    const user = users.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ status: "error", msg: "User not found." });
    }

    const { password, ...userProfile } = user;
    res.status(200).json({ status: "success", user: userProfile });
};

export const updateUserProfile = (req, res) => {
    const userId = parseInt(req.user.id);

    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ msg: "User not found." });
    }

    users[userIndex] = { ...users[userIndex], ...req.body };

    res.status(200).json({ msg: "User updated successfully", user: users[userIndex] });
};

export const registerUser = async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ msg: "Please provide all required fields." });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ msg: "User with this email already exists." });
    }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            isAdmin: false,
        };

        users.push(newUser);

        res.status(201).json({ msg: "User registered successfully", user: newUser });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please provide email and password." });
    }

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ msg: "Invalid email or password." });
    }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        }
    });
};
