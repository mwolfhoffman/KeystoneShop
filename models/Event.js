var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event Model
 * ==========
 */

var Event = new keystone.List('Event', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Event.add({
	title: { type: String, required: true },
	image: { type: Types.CloudinaryImage },
    description: {type: Types.Textarea},
	datetime: {type: Types.Datetime},
	location: {type: Types.Location}
});

Event.register();