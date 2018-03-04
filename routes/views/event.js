var keystone = require('keystone');
 var numeral = require('numeral');

exports = module.exports = function (req, res) {
    var locals = res.locals;
    locals.section = 'events';
    locals.filters = {
        event: req.params.event
    };
    locals.data = {
        events: []
    };
    locals.numeral = numeral;


    var q = keystone.list('Event').model.findOne({
        slug: locals.filters.event
    })

    q.exec(function (err, result) {
        if (err) {
            throw err;
        } else {
            locals.data.event = result;
            return res.send(locals);
        }
    });

};
