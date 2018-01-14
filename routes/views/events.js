var keystone = require('keystone');

exports = module.exports = function (req, res) {
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

	keystone.list('events').model.find().exec(function (err, results) {
		if (err) {
			throw err;
		}
		locals.data.events = results;
		return res.send(res.locals);
	})
};
