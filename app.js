// Markus Järvinen 2018

var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    cookieParser    = require("cookie-parser"),
    LocalStrategy   = require("passport-local"),
    flash           = require("connect-flash"),
    Hotel           = require("./models/hotel"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    session         = require("express-session"),
    methodOverride  = require("method-override");
    
// Requiring routes
var commentRoutes   = require('./routes/comments.js');
var hotelRoutes     = require('./routes/hotels.js');
var indexRoutes     = require('./routes/index.js');

// Assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

var url = process.env.DATABASEURL || "mongodb://localhost:27017/hotelsdb"

mongoose.connect(url, { useMongoClient: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));

// Require moment
app.locals.moment = require('moment');


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hold the door!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);  
app.use("/hotels", hotelRoutes);
app.use("/hotels/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Hotels Server Has Started!"); // Can be commented out
});