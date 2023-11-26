const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
// Middleware
app.use(cors());
app.use(express.json());

// API routes setup
const userRoutes = require('./Routes/Users');
const postRoutes = require('./Routes/Post');
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);

app.get('/check-url', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Ensure that the URL includes the protocol (http:// or https://)
        const fullUrl = /^(http|https):\/\//i.test(url) ? url : `http://${url}`;

        const response = await axios.head(fullUrl);
        const isValid = response.status === 200;
        res.json({ isValid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Connected to the database');
});



// Start the server
const port = 4050;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});