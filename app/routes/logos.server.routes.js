'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logos = require('../../app/controllers/logos.server.controller');

	// Logos Routes
	app.route('/logos')
		.get(logos.list)
		.post(users.requiresLogin, logos.create);

	app.route('/logos/:logoId')
		.get(logos.read)
		.put(users.requiresLogin, logos.hasAuthorization, logos.update)
		.delete(users.requiresLogin, logos.hasAuthorization, logos.delete);
	
	app.route('/logos/user/:userId')
        .get(logos.userRead);

	// Finish by binding the Logo middleware
	app.param('logoId', logos.logoByID);
	app.param('userId', logos.userByID);
};
