var keystone = require('keystone');

loadCurrentPost = (req, res) => {
	var q = keystone.list('Post').model.findOne({
		state: 'published',
		slug: res.locals.filters.post
	}).populate('author categories');

	q.exec(function (err, result) {
		if (err) {
			return reject(err);
		}
		res.locals.data.post = result;
		return res.send(res.locals);
	});
};

exports = module.exports = function (req, res) {
	var locals = res.locals;

	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: []
	};

	loadCurrentPost(req, res);
};