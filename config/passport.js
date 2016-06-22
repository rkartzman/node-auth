// load everything we need 

var LocalStrategy   = require('passport-local').Strategy;
// var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;


// load up the user model

var User            = require('../app/models/user');

// load the auth variables 


// var configAuth      = require('./auth');

// expose this function to our app using module.exports 
module.exports = function(passport) {
	// passport session setup 
	// required for persistent login sessions 
	// passport needs ability to serialize and unserialize 


	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});


	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email', 
		passwordField : 'password', 
		passReqToCallback : true // allows us to passback the entire request to callback 
	},
	function(req, email, password, done) {
		// asynchronous 
		// User.findOne wont fire unless data is sent back 

		process.nextTick(function() {
			User.findOne({ 'local.email' : email }, function(err, user) {
				if (err)
					return done(err);

				if(user) {
					return done(null, false, req.flash('signupMessage', 'That email is already taken'));
				} else {
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);

					});
				}

			});
		});
	}));
	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID, 
		clientSecret: configAuth.googleAuth.clientSecret, 
		callbackURL: configAuth.googleAuth.callbackURL, 
	}, 

	function(token, refreshToken, profile, done) {
		// make the code asynchronous 
		// User.findOne wont fire until we have all our data back from google 

		process.nextTick(function() {

			// try to find the user based on their google id 

			User.findOne({ 'google.id': profile.id }, function(err, user) {
				if(err) 
					return done(err)
				if(user) {
					// if a user is found log them in 
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.google.id = profile.id; 
					newUser.google.token = token;
					newUser.google.name = profile.displayName;
					newUser.google.email = profile.emails[0].value;

					// save the user 

					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}

			});
		});
	}));
};
