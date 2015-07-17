'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Logo Schema
 */
var LogoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Logo name',
		trim: false
	},
	outputLogo: {
        type: String,
        default: '',
        required: 'Fatal Error'
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Logo', LogoSchema);
