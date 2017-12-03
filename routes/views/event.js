var keystone = require('keystone');
var async = require('async');
var numeral = require('numeral');

exports = module.exports = function (req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    // Set locals
    locals.section = 'events';
    locals.filters = {
        event: req.params.event
    };
    locals.data = {
        events: []
        };
    locals.numeral = numeral;

    // Load the current product
    view.on('init', function (next) {

        var q = keystone.list('Event').model.findOne({
            slug: locals.filters.event
        })

        q.exec(function (err, result) {
            if (err) {
                return next(err);
            } else {

                locals.data.event = result;
                return next();
            }
        });

    });

    // Render the view
    view.render('event');

};
