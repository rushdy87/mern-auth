import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created succssfully..' });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, 'Invalid password'));
    }
    const { password: hashedPassword, ...user } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000);
    res
      .cookie('auth_app_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie('auth_app_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = User({
        username:
          name.split(' ').join('').toLowerCase() +
          Math.floor(Math.random() * 1000).toString(),
        email: email,
        password: hashedPassword,
        profilePicture: photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie('auth_app_token', token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  res.clearCookie('auth_app_token').status(200).json('Signout success');
};
