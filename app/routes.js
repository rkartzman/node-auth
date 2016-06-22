// routes ======================


// load the todo model 


/* api ------------------- */
module.exports = function(app, passport) {

	




	// application ----------------

	// app.get('*', function(req, res) {
	// 	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	// 	// this will loud our single index.html file when we hit localhost:8080
	// });
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs');
	});

	app.get('/signup', function(req, res) {
		res.render('signup.ejs');
	});

	app.post('/signup', passport.authenticate('local-signup' {
		successRedirect : '/profile', 
		failureRedirect : '/signup', 
		failureFlash : true	
	}));

	app.get('/profile', function(req, res) {
		res.render('profile.ejs', {
			user: req.user // get the user out of session and pass to template 
		});
	});


	app.get('/logout', function(req, res) {
		req.logout(); // provided by passport 
		res.redirect('/');
	});

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session carry on

	if(req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page

	res.redirect('/');
}
