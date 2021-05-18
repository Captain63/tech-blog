const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/date');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'siWItTzFHhVnfrIQyZeS',
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