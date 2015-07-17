'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Logo = mongoose.model('Logo'),
	_ = require('lodash');

/**
 * Create a Logo
 */
exports.create = function(req, res) {
	var logo = new Logo(req.body);
	logo.user = req.user;

	logo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logo);
		}
	});
};

/**
 * Show the current Logo
 */
exports.read = function(req, res) {
	res.jsonp(req.logo);
};

/**
 * Update a Logo
 */
exports.update = function(req, res) {
	var logo = req.logo ;

	logo = _.extend(logo , req.body);

	logo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logo);
		}
	});
};

/**
 * Delete an Logo
 */
exports.delete = function(req, res) {
	var logo = req.logo ;

	logo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logo);
		}
	});
};

/**
 * List of Logos
 */
exports.list = function(req, res) { 
	Logo.find().sort('-created').populate('user', 'displayName').exec(function(err, logos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(logos);
		}
	});
};

exports.userRead = function(req, res) {
    console.log('hello ' + req.user);
    res.jsonp(req.user);
};

/**
 * Logo middleware
 */
exports.logoByID = function(req, res, next, id) { 
	Logo.findById(id).populate('user', 'displayName').exec(function(err, logo) {
		if (err) return next(err);
		if (! logo) return next(new Error('Failed to load Logo ' + id));
		req.logo = logo ;
		next();
	});
};

exports.userByID = function(req, res, next, id) {
    Logo.find({'user':id}).populate('user', 'displayName').exec(function(err, user) {
        if (err) return next(err);
        if (! user) return next(new Error('Failed to load Logo ' + id));
        req.user = user;
        next();
    });
};

/**
 * Logo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.logo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
