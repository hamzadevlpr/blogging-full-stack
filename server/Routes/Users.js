const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../Models/UserModels');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' })
}


router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(401).json({ error: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        // create token
        // const token = createToken(newUser._id);

        res.status(201).json({ message: 'User registered successfully', email: newUser.email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user with the provided email exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not Found' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = createToken(user._id);

        const userData = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            photo: user.photo,
            message: "Login Successfull",
            token: token
        };
        res.status(200).json({
            ...userData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, photo } = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId,
            { fullName, email, photo }, { new: true }).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;