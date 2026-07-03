import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content || title === '' || content === '') {
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    const newPost = new Post({
        ...req.body,
        userId: req.user.id
    });

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }
    catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.postId && { _id: req.query.postId }),
        }).sort({ updatedAt: -1 });

        res.status(200).json(posts);
    }
    catch (error) {
        next(error);
    }
};

export const updatepost = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    image: req.body.image
                }
            },
            { new: true }
        );

        if (!updatedPost) {
            return next(errorHandler(404, 'Post not found'));
        }

        res.status(200).json(updatedPost);
    }
    catch (error) {
        next(error);
    }
};
