const connectDB = require('../config/db');
const bcrypt = require('bcrypt');


const register = async (req, res) => {
    const db = await connectDB();
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.run(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        res.json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const login = async (req, res) => {
    const db = await connectDB();
    const { email, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const { password, ...userInfo } = user; 
            res.json(userInfo);
        } else {
            res.status(401).json({ message: "Invalid Password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { register,login };