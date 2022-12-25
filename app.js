if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}


const express = require("express")
const app = express();
const path = require("path")
const mongoose = require("mongoose")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const ExpressErrors = require("./utils/ExpressErrors")
const complaintRouter = require("./routes/complaints")
const commentRouter = require("./routes/comments")
const userRouter = require("./routes/users")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const User = require("./models/user");
const { Module } = require("module");
require("./passportGoogle")

mongoose.connect(process.env.MONGO_ATLAS_URL)
    .then(() => {
        console.log("Connected to mongoose")
    })
    .catch((e) => {
        console.log(e);
    })

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_ATLAS_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'squirrel'
    }
})

const sessionConfig =
{
    store,
    secret: 'veryClassifiedMuch$ecr@t',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,// expires after 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())


//passport stuff
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

//all flash alerts assigned to response here(null assigned if nothing in req.flash)
app.use(async (req, res, next) => {
    res.locals.currentUser = null
    if(req.user){
        const user = await User.findOne({googleID: req.user.id})
        res.locals.currentUser = user //session info of a user from passport
    }
    res.locals.success = req.flash("success")//for flash
    res.locals.error = req.flash('error')//same
    next()
})

app.get("/google/login", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/oauth2/redirect/google", passport.authenticate('google', { failureRedirect: '/google/failedlogin', failureFlash: true, keepSessionInfo: true }),
    function (req, res) {
        res.redirect('/complaints');
    })

app.get("/google/failedlogin", (req, res) =>{
    req.flash('error', "Only use SMVDU email IDs");
    
    res.redirect("/")
})

app.get('/google/logout', (req, res, next) => {
    console.log(req)
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out');
        res.redirect('/complaints');
    })
})

app.get("/", (req, res) => {
    res.render("home.ejs")
})

app.use("/", userRouter)
app.use("/complaints", complaintRouter)
app.use("/complaints/:id/comments", commentRouter)
app.use(express.static(path.join(__dirname, 'public')))


//incase request is to an invalid url
app.all("*", (req, res, next) => {
    next(new ExpressErrors("NOT FOUND", 404))
})

app.use((err, req, res, next) => {
    const { message = "something wrong i can feel it", status = 500 } = err
    res.status(status)
    res.render("error.ejs", { error: err })
})

app.listen(process.env.PORT||5000, () => {
    console.log("listening on port 5000")
})

module.exports = app;