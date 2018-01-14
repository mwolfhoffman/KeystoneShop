var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');

loadCategory = (req, res) => {
	return new Promise((resolve, reject) => {
		if (req.params.category) {
			keystone.list('ProductCategory').model.findOne({ key: res.locals.filters.category })
				.exec(function (err, result) {
					res.locals.data.category = result;
					if (err) {
						throw err;
					}
				});
		} else {
			return resolve(res.locals.data);
		}
	})
}

loadCategories = (req, res) => {
	return new Promise((resolve, reject) => {

		keystone.list('ProductCategory').model.find().where('primary', true).sort('name').populate('categories').exec(function (err, results) {

			if (err) {
				return reject(err);
			}
			res.locals.data.categories = results;
			return resolve(res.locals.data);
		});
	})
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

	loadCategories(req, res)
		.then((data) => {
			loadCategory(req, res)
		})
		.then((data) => {
			loadProducts(req, res);
		});
};
