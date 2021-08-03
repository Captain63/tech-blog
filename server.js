const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const compression = require('compression');
const routes = require('./controllers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/date');

const app = express();
const PORT = process.env.PORT || 3001;

// Reads .env file
require('dotenv').config();

// Destructure secret string from .env file
const { SECRET } = process.env;

const sess = {
  secret: SECRET,
  cookie: {
      // 15 minutes in milliseconds
      maxAge: 900000
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const hbs = exphbs.create({ helpers });

// Add compression for all server requests
app.use(compression());

// Browser redirects
app.use(function forceLiveDomain(req, res, next) {
  // If request has a domain for the Heroku deployment or starts with "www.", redirect to base domain
  if (req.get('Host').includes("herokuapp") || req.get('Host').includes("www.")) {
    return res.redirect(301, `https://stephentechblog.com${req.path}`);
  }
  return next();
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session(sess));

// Configure server to accept json requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow access to the public directory for client
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
});