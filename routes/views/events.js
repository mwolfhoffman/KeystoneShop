var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');


exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'events';
	locals.moment = require('moment');	
	locals.numeral = numeral;
	locals.filters = {
		//  category: req.params.category
	};
	locals.data = {
		events: [],
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('events').model.find().exec(function(err, results) {
				if (err || !results.length) {
				return next(err);
			}

			locals.data.events = results;
			return next();
			});	
	});

	// Render the view
	view.render('events');
	
};
