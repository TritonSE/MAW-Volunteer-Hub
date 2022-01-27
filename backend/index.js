const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

const UserModel = require('./models/model');

mongoose.connect("mongodb://127.0.0.1:27017/passport-jwt", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./models/auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);


// require('.models/auth/auth');

// const authRoutes = require('./routes/authroutes');
// const userRoutes = require('./routes/userroutes');

// const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/auth', authRoutes); // authentication routes are not JWT protected
// app.use('/user', passport.authenticate('jwt', { session: false }), userRoutes); // all user routes are JWT protected


// Handle errors.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log("ERRORRRR");
  res.json({ error: err });
});

app.listen(5000, () => {
  console.log('Server started.')
});
