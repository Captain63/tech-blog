const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get(/herokuapp/, async (req, res) => {
    try {
        res.redirect(301, "https://stephentechblog.com/")
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show homepage
router.get("/", async (req, res) => {
    try {
        // Get all posts and join with user data
        const postData = await Post.findAll({
            include: [
                {
                model: User,
                attributes: ['name'],
                },
            ],
            order: [
                ["post_date", "DESC"]
            ]
        });
    
        // Serialize data so the template can read it
        const posts = postData.map(post => post.get({ plain: true }));
    
        // Pass serialized data and session flag into template
        res.render('homepage', { 
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show blog post with corresponding ID
router.get("/post/:id", async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            // Join with User and Comment models
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    order: [
                        ["comment_date", "ASC"]
                    ],
                    include: {
                        model: User,
                        attributes: ['name']
                    }
                }
            ]
        })

        const post = postData.get({ plain: true });

        res.render("post", { 
            ...post,
            loggedIn: req.session.loggedIn
         });
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show dashboard -- must be signed in
router.get("/dashboard", withAuth, async (req, res) => {
    try {
        const postData = await Post.findAll({
            // Retrieve blog posts that match user id for current session
            where: {
                user_id: req.session.userId
            },
            order: [
                ["post_date", "DESC"]
            ]
        })

        const posts = postData.map(post => post.get({ plain: true }));

        res.render("dashboard", { 
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show blog post drafting page -- must be signed in
router.get("/dashboard/new-post", withAuth, (req, res) => {
    try {
        res.render("write", { 
            // Flag for front-end code to show "Post" button underneath form
            existingPost: false
        });
    } catch {
        res.status(500).json(err);
    }
})

// Show blog post updating/deleting page
router.get("/dashboard/edit/:id", withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id);

        const post = postData.get({ plain: true });

        res.render("write", { 
            ...post,
            // Flag for front-end code to show "Edit" + "Delete" buttons underneath form
            existingPost: true,
            loggedIn: req.session.loggedIn
         });
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show login page
router.get("/login", (req, res) => {
    // If the user is already logged in, redirect the request to homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
})

// Show sign up page
router.get("/signup", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
})

module.exports = router;