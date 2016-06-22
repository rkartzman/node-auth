// our user model

// load stuff here 

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

	local          : {
		email      : String, 
		password   : String, 
	}, 
	facebook       : {
		id         : String, 
		token      : String, 
		email      : String, 
		name       : String
	}, 
	google         : {
		id         : String, 
		token      : String,
		email      : String,
		name       : String
	}
});

// methods ======================

// generating a hash 

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltsSync(8), null);
}

// checking if password is valid 

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
}


module.exports = mongoose.model('User', userSchema);