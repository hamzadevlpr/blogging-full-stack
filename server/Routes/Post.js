const express = require('express');
const requireAuth = require('../middleware/Authentication.js');
const router = express.Router();
const Post = require('../Models/PostSchema');
const User = require('../Models/UserModels');
const Comment = require('../Models/CommentSchema.js');



router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({});
        // fetch the user name and photo from the database and add it to the post object
        const postsWithUserInfo = await Promise.all(posts.map(async post => {
            const user = await User.findById(post.user_id);
            return {
                ...post._doc,
                user: {
                    photo: user.photo,
                    name: user.fullName,
                }
            };
        }));
        res.status(200).json(postsWithUserInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});
// Require authentication for all routes using requireAuth middleware
router.use(requireAuth);

router.get('/myposts', async (req, res) => {
    try {
        const posts = await Post.find({ user_id: req.user._id });
        const postsWithUserInfo = await Promise.all(posts.map(async post => {
            const user = await User.findById(post.user_id);
            return {
                ...post._doc,
                user: {
                    photo: user.photo,
                    name: user.fullName,
                }
            };
        }));
        res.status(200).json(postsWithUserInfo);
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


// update post by slug
router.put('/update/:slug', async (req, res) => {
    try {
        const { title, slug, content, featuredImage } = req.body;
        const user_id = req.user._id;
        const { slug: oldSlug } = req.params;

        // Check if the post with the old slug exists
        const existingPost = await Post.findOne({ slug: oldSlug });

        if (!existingPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // If the slug is being updated, check if the new slug already exists
        if (slug !== oldSlug) {
            const postWithNewSlug = await Post.findOne({ slug });

            if (postWithNewSlug) {
                return res.status(400).json({ error: 'A post with the same slug already exists.' });
            }
        }

        // Update the post
        existingPost.title = title;
        existingPost.slug = slug;
        existingPost.content = content;
        existingPost.featuredImage = featuredImage;
        existingPost.user_id = user_id;

        // Save the updated post to the database
        const updatedPost = await existingPost.save();

        res.status(200).json({ message: 'Post Updated Successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        const post = await Post.findOne({ slug }).populate('user_id', ['_id', 'username', 'photo', 'fullName']);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const { user_id, ...postWithoutUser } = post.toObject();
        // Format the date
        const formattedDate = new Date(post.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const postWithUserInfo = {
            ...postWithoutUser,
            user: {
                name: user_id.fullName,
                photo: user_id.photo,
                _id: user_id._id,
            },
            formattedCreatedAt: formattedDate,
        };

        res.status(200).json(postWithUserInfo);
    } catch (error) {
        console.error('Error fetching post details:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/comments', async (req, res) => {
    try {
        const { user, comment, post } = req.body;

        // Create a new comment
        const newComment = new Comment({
            user,
            comment,
            post,
        });

        // Save the comment to the database
        const savedComment = await newComment.save();

        res.status(201).json({ message: 'Comment Created Successfully!', comment: savedComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Create a route to get comments for a specific post
router.get('/comments/:postSlug', async (req, res) => {
    try {
        const { postSlug } = req.params;

        // Assuming you have a Post model with a 'slug' field
        const post = await Post.findOne({ slug: postSlug });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comments = await Comment.find({ post: post._id }).populate('user', 'fullName photo');

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;