if(process.env.NODE_ENV !='production'){
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const req = require('express/lib/request');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const res = require('express/lib/response');
const ExpressError =require('./utils/ExpressError');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const mongoSanitize =require('express-mongo-sanitize');

// routes
const surfpointsRoutes = require('./routes/surfpoints');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// port
const port = process.env.PORT || 3000;


const dbUrl =process.env.DB_URL ||  'mongodb://127.0.0.1:27017/surf-camp'
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify:false
})
.then(() => {
  console.log('MongoDBコネクションOK');
})
.catch((err) => {
  console.log('MongoDBコネクションError', err);
});

const app = express();


app.engine('ejs',ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ミドルウェア
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'mysecret'

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:secret,
    touchAfter:24*3600,
  }
});

store.on('error',e =>{
  console.log('セッションストアエラー',e);
});

const sessionConfig ={
  store,
  name:"session",
  secret:secret,
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    maxAge:1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.serializeUser((user, done) => {
  done(null, user._id);
});

app.use(flash());

app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
    'https://api.mapbox.com',
    'https://*.tiles.mapbox.com',
    'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
    'https://images.unsplash.com'
];

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



app.get('/', (req, res) => {
  res.render('home');
});


app.use('/',userRoutes);
app.use('/surfpoints',surfpointsRoutes);
app.use('/surfpoints/:id/reviews',reviewRoutes);


app.all('*',(req,res,next) => {
  next(new ExpressError('ページが見つかりませんでした',404));
});

app.use((err,req,res,next) =>{
  const {statusCode = 500} =err;
  if(!err.message){
    err.message ='問題が起きました';
  }

  res.status(statusCode).render('error',{err});
});

app.listen(port, () => {
  console.log(`ポート${port}でリクエストを受付中`);
});

