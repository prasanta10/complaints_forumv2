const express = require("express")
const passport = require("passport")
const User = require("../models/user")
const router = express.Router({ mergeParams: true })
const catchAsync = require("../utils/catchAsync")

module.exports = {
    renderRegister: (req, res) => {
        res.render("users/register.ejs")
    },
    register: async (req, res, next) => {
        try {
            const { email, username, password } = req.body
            const user = new User({ username, email })
            const newUser = await User.register(user, password)
            req.login(newUser, (err) => {
                if (err) {
                    return next(err)
                }
                req.flash('success', 'Registration Succesful')
                res.redirect("/complaints");
            })
        }
        catch (e) {
            req.flash('error', e.message)
            res.redirect("/register")
        }
    },
    renderLogin: (req, res) => {
        res.render("users/login.ejs");
    },
    login: (req, res) => {
        req.flash('success', 'Welcome Back')
        const redirectUrl = req.session.returnTo || '/complaints'
        delete req.session.returnTo
        res.redirect(redirectUrl)
    },
    logout: (req, res, next) => {
        req.logout(err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Logged Out');
            res.redirect('/campgrounds');
        })
    }
}
