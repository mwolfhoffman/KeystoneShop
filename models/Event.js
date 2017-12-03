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
	datetime: {type: Types.Datetime, required: true, default: Date.now},
	location: {type: Types.Location, required: false , intial: {name:'',number:'', street1: "123 Main Street", street2:'', suburb: 'Boise', state: "Idaho", postcode:'83706', country: 'United States', geo:[] }}
});

Event.register();