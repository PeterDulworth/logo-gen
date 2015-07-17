'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Logo = mongoose.model('Logo'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, logo;

/**
 * Logo routes tests
 */
describe('Logo CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Logo
		user.save(function() {
			logo = {
				name: 'Logo Name'
			};

			done();
		});
	});

	it('should be able to save Logo instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logo
				agent.post('/logos')
					.send(logo)
					.expect(200)
					.end(function(logoSaveErr, logoSaveRes) {
						// Handle Logo save error
						if (logoSaveErr) done(logoSaveErr);

						// Get a list of Logos
						agent.get('/logos')
							.end(function(logosGetErr, logosGetRes) {
								// Handle Logo save error
								if (logosGetErr) done(logosGetErr);

								// Get Logos list
								var logos = logosGetRes.body;

								// Set assertions
								(logos[0].user._id).should.equal(userId);
								(logos[0].name).should.match('Logo Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Logo instance if not logged in', function(done) {
		agent.post('/logos')
			.send(logo)
			.expect(401)
			.end(function(logoSaveErr, logoSaveRes) {
				// Call the assertion callback
				done(logoSaveErr);
			});
	});

	it('should not be able to save Logo instance if no name is provided', function(done) {
		// Invalidate name field
		logo.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logo
				agent.post('/logos')
					.send(logo)
					.expect(400)
					.end(function(logoSaveErr, logoSaveRes) {
						// Set message assertion
						(logoSaveRes.body.message).should.match('Please fill Logo name');
						
						// Handle Logo save error
						done(logoSaveErr);
					});
			});
	});

	it('should be able to update Logo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logo
				agent.post('/logos')
					.send(logo)
					.expect(200)
					.end(function(logoSaveErr, logoSaveRes) {
						// Handle Logo save error
						if (logoSaveErr) done(logoSaveErr);

						// Update Logo name
						logo.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Logo
						agent.put('/logos/' + logoSaveRes.body._id)
							.send(logo)
							.expect(200)
							.end(function(logoUpdateErr, logoUpdateRes) {
								// Handle Logo update error
								if (logoUpdateErr) done(logoUpdateErr);

								// Set assertions
								(logoUpdateRes.body._id).should.equal(logoSaveRes.body._id);
								(logoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Logos if not signed in', function(done) {
		// Create new Logo model instance
		var logoObj = new Logo(logo);

		// Save the Logo
		logoObj.save(function() {
			// Request Logos
			request(app).get('/logos')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Logo if not signed in', function(done) {
		// Create new Logo model instance
		var logoObj = new Logo(logo);

		// Save the Logo
		logoObj.save(function() {
			request(app).get('/logos/' + logoObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', logo.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Logo instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Logo
				agent.post('/logos')
					.send(logo)
					.expect(200)
					.end(function(logoSaveErr, logoSaveRes) {
						// Handle Logo save error
						if (logoSaveErr) done(logoSaveErr);

						// Delete existing Logo
						agent.delete('/logos/' + logoSaveRes.body._id)
							.send(logo)
							.expect(200)
							.end(function(logoDeleteErr, logoDeleteRes) {
								// Handle Logo error error
								if (logoDeleteErr) done(logoDeleteErr);

								// Set assertions
								(logoDeleteRes.body._id).should.equal(logoSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Logo instance if not signed in', function(done) {
		// Set Logo user 
		logo.user = user;

		// Create new Logo model instance
		var logoObj = new Logo(logo);

		// Save the Logo
		logoObj.save(function() {
			// Try deleting Logo
			request(app).delete('/logos/' + logoObj._id)
			.expect(401)
			.end(function(logoDeleteErr, logoDeleteRes) {
				// Set message assertion
				(logoDeleteRes.body.message).should.match('User is not logged in');

				// Handle Logo error error
				done(logoDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Logo.remove().exec();
		done();
	});
});