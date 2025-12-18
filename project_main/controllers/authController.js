const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const path = require('path');
const fs = require('fs');
const { connected } = require('process');

// Use Map to store user sessions or quick lookup
const users = new Map(); 

// Render the registration page
exports.renderRegister = (req, res) => {
    res.render('register');
};

// Handle user registration
exports.register = async (req, res) => {
    const { username, password } = req.body;
    const allUsers = UserModel.getAllUsers();
    console.log(UserModel.getAllUsers());

    if (allUsers.items.some(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword };

    UserModel.addUser(newUser);
    users.set(username, newUser); // ✅ Add to memory for login

    // res.status(201).json({ message: 'User registered successfully' });
    res.redirect('/login');
};

// Render the login page
exports.renderLogin = (req, res) => {
    res.render('login');
};

// Handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    const user = UserModel.getUserByUsername(username);
    console.log(UserModel.getAllUsers());

    if (!user) {
        return res.render('login', { errorMessage: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.render('login', { errorMessage: 'Invalid username or password' });
    }

    req.session.user = { username: user.username };
    res.redirect('/menu');
};

// Handle user logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        console.log('✅ User logged out');
        res.redirect('/login');
    });
};

// Middleware to protect routes
exports.authenticate = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};
