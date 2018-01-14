var keystone = require('keystone');

LoadAllBlogCategories = (req, res) => {
	return new Promise((resolve, reject) => {
		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {
			if (err || !results.length) {
				return reject(err);
			}

			res.locals.data.categories = results;
			return resolve(true);
		});
	});
};

loadBlogCategory = (req, res) => {
	return new Promise((resolve, reject) => {
		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: res.locals.filters.category }).exec(function (err, result) {
				if (err) {
					return reject(err);
				}
				res.locals.data.category = result;
				return resolve(true);
			});
		} else
			return resolve(true);
	})
};

loadBlogPosts = (req, res) => {
	return new Promise((resolve, reject) => {
		var q = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 10
		})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('author categories');

		if (res.locals.data.category) {
			q.where('categories').in([res.locals.data.category]);
		}

		q.exec(function (err, results) {
			if (err) {
				return reject(err);
			}

			res.locals.data.posts = results;
			return res.send(res.locals)
		})
	})
}

exports = module.exports = function (req, res) {
	var locals = res.locals;
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};

	LoadAllBlogCategories(req, res)
		.then(data => {
			loadBlogCategory(req, res)
				.then(data => {
					loadBlogPosts(req, res);
				})
		})
}