if(process.env.NODE_ENV != "production"){
  require("dotenv").config()
}

const express = require("express");
let app = express();
const mongoose = require("mongoose");
let path = require("path");
let methodOverride = require("method-override");
let ejsMate = require("ejs-mate");
let listing = require("./routers/listings.router.js")
let review = require("./routers/reviews.router.js")
let user = require("./routers/users.router.js")
let session = require("express-session")
let mongoStore = require("connect-mongo")
let flash = require("connect-flash")
let passport = require("passport")
let passportLocal = require("passport-local");
const User = require("./models/user.model.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

let dbUrl = process.env.ATLASDB_URL

const store = mongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
})

store.on("error",()=>{
  console.log("error on express session store! , ::: ",err)
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
  }
}


app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


main()
  .then((res) => {
    console.log("connected with database!");
  })
  .catch((err) => console.log(err));

async function main() {
  let connectionInstance = await mongoose.connect(dbUrl);
  console.log(`connection Instance : ${connectionInstance.connection.host}`);
}

app.get("/",(req,res)=>{
  res.send("root page of wanderlust go to listing!")
})

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user
  next()
})

app.use("/listing",listing)
app.use("/listing/:id/review",review)
app.use("/user",user)

app.use((err, req, res, next) => {
  res.send(err.message);
});

app.use((req, res) => {
  res.send("Page Not Found !");
});

app.listen(4000, () => {
  console.log("serving on port : 4000");
});
