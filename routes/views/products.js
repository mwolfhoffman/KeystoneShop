var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');

loadCategory = (req, res, cb) => {
	if (req.params.category) {
		keystone.list('ProductCategory').model.findOne({ key: res.locals.filters.category }).exec(function (err, result) {
			res.locals.data.category = result;
			throw err;
		});
	} else {
		return cb();
	}
}

loadCategories = (req, res, cb) => {
	keystone.list('ProductCategory').model.find().where('primary', true).sort('name').populate('categories').exec(function (err, results) {

		if (err) {
			throw err;
		}
		res.locals.data.categories = results;
		return cb();
		// Load the counts for each category
		// async.each(res.locals.data.categories, function (category, next) {
		// 	keystone.list('Product').model.count().where('categories').in([category.id]).exec(function (err, count) {
		// 		category.productCount = count;
		// 		return next(err);
		// 	});

		// }, function (err) {
		// 	return next(err);
		// });
	});

};

loadProducts = (req, res) => {
	var q = keystone.list('Product').paginate({
		page: req.query.page || 1,
		perPage: 13,
		maxPages: 10
	})
		.sort('title')

	if (res.locals.data.category) {
		var inCategories = [res.locals.data.category]

		for (var i = 0; i < res.locals.data.category.categories.length; i++) {
			var subCategory = res.locals.data.category.categories[i]

			inCategories.push(subCategory)
		}

		q.where('categories').in(inCategories);
	}

	q.exec(function (err, results) {
		console.log('Got results')
		console.log(results)

		res.locals.data.products = results;
		if (err) {
			return next(err);
		} else {
			return res.send(res.locals.data)
		}
	});

};

exports = module.exports = function (req, res) {
	var locals = res.locals;

	// Init locals
	locals.section = 'store';
	locals.numeral = numeral;
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		products: [],
		categories: []
	};

	loadCategories(req, res, () => {
		loadCategory(req, res, () => {
			loadProducts(req, res);
		})
	})
};
