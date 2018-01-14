var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');
// var Promise = require("bluebird");

loadAllCategories = (req, res) => {
	return new Promise((resolve, reject) => {
		keystone.list('ProductCategory').model.find().where('primary', true).sort('name').populate('categories').exec(function (err, results) {
			if (err) {
				return reject(err);
			}
			res.locals.data.categories = results;
			return resolve(true);
		})
	});

};

loadProduct = (req, res) => {
	return new Promise((resolve, reject) => {
		var q = keystone.list('Product').model.findOne({
			slug: res.locals.filters.product
		})

		q.exec(function (err, result) {
			if (err) {
				return reject(err);
			}
			res.locals.data.product = result;
			res.locals.data.category = result.categories[0] || null;
			return res.send(res.locals);
		});
	});
};


exports = module.exports = function (req, res) {
	var locals = res.locals;
	locals.section = 'products';
	locals.filters = {
		product: req.params.product
	};
	locals.data = {
		products: [],
		categories: []
	};
	locals.numeral = numeral;

	loadAllCategories(req, res)
		.then((data) => {
			return loadProduct(req, res)
		});

};
