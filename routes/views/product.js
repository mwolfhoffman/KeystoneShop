var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');

// Load all categories
// view.on('init', function(next) {
loadCategories = (req, res, cb) => {
	keystone.list('ProductCategory').model.find().where('primary', true).sort('name').populate('categories').exec(function (err, results) {

		if (err) {
			return next(err);
		}

		res.locals.data.categories = results;
		return cb();
		// Load the counts for each category
		// async.each(locals.data.categories, function(category, next) {
		// 	keystone.list('Product').model.count().where('categories').in([category.id]).exec(function(err, count) {
		// 		category.productCount = count;
		// 		next(err);
		// 	});

		// }, function(err) {
		// 	next(err);
		// });

	});

};

// Load the current product
// view.on('init', function(next) {
loadProduct = (req, res) => {
	var q = keystone.list('Product').model.findOne({
		slug: res.locals.filters.product
	})

	q.exec(function (err, result) {
		if (err) {
			return next(err);
		}
		res.locals.data.product = result;
		res.locals.data.category = result.categories[0] || null;
		res.send(res.locals);
	});
};


exports = module.exports = function (req, res) {

	// var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'products';
	locals.filters = {
		product: req.params.product
	};
	locals.data = {
		products: [],
		categories: []
	};
	locals.numeral = numeral;

	// Render the view
	//view.render('product');

	loadCategories(req, res, () => {
		loadProduct(req, res);
	})
};
