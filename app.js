let express = require('express');
let mongoose = require('mongoose');
let keys = require('./config/keys');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let exphbs = require('express-handlebars');
let path = require('path');
let bodyParser = require('body-parser');
let hbsHelpers = require('./helpers/hbs');
let methodOverrid = require('method-override');

// Routes
let index = require('./routes/index');
let auth = require('./routes/auth');
let stories = require('./routes/stories');

require('./config/passport')(passport);

mongoose.Promise = global.Promise;
mongoose.connect(
  keys.mongoURI,
  {
    useNewUrlParser: true
  },
  err => {
    if (!err) {
      console.log('Mongo connected');
    } else {
      throw err;
    }
  }
);

let app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverrid('_method'));

// Static middleware
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Handlebars middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: hbsHelpers,
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

//
app.use(cookieParser());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server work on port ${PORT}`));
