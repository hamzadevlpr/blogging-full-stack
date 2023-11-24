const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// Middleware
app.use(cors());
app.use(express.json());

// API routes setup
const userRoutes = require('./Routes/Users');
const postRoutes = require('./Routes/Post');
app.use('/api/users', userRoutes);
app.use('/api/post', postRoutes);


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