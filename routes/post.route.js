import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { create, getposts, updatepost } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);

export default router;
