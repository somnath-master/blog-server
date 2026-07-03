import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res) =>{
    const { username, email, password } = req.body;

    if (!username || !email || !password || 
    username === '' || email === '' || password === '') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newUser = new User({
        username,
        email,
        password: bcryptjs.hashSync(password, 10),
    });

    try {
        await newUser.save();
        res.json('SignUp Successful');
    } 
    catch(error) {
        res.status(500).json({ message: error.message });
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;

        res
            .status(200)
            .cookie('access_token', token, { httpOnly: true })
            .json(rest);
    }
    catch (error) {
        next(error);
    }
};