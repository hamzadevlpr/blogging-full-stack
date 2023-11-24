const express = require('express');
const requireAuth = require('../middleware/Authentication.js');
const router = express.Router();
const Post = require('../Models/PostSchema');

// Require authentication for all routes using requireAuth middleware
router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        // fetch posts from the database
        const posts = await Post.find({ user_id: req.user._id });

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


router.post('/add', async (req, res) => {
    try {
        const { title, slug, content, featuredImage } = req.body;
        const user_id = req.user._id;


        // Check if a post with the same slug already exists
        const existingPost = await Post.findOne({ slug });

        if (existingPost) {
            return res.status(400).json({ error: 'A post with the same slug already exists.' });
        }

        // Create a new post
        const newPost = new Post({
            title,
            slug,
            content,
            featuredImage,
            user_id: user_id,
        });

        // Save the post to the database
        const savedPost = await newPost.save();

        res.status(201).json({ message: 'Post Created Successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;