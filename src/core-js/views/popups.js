Mediakron.Popup = {};
Mediakron.Popup.default = Backbone.View.extend({
	template: JST['popup.default'],
	initialize: function(object){
		this.contents = object;
	},
	render: function(){
		this.$el.append(this.template(this.contents));
		return this;
	},
	events: {}
});

Mediakron.Popup.MapEdit = Mediakron.Popup.default.extend({
	initialize: function(object){
		this.template = JST['popup.map.edit'];
		this.contents = object;
		this.contents.item = Mediakron.getItemFromURI(object.uri);
	},
	render: function(){
		this.el = '#map-edit-'+this.contents.uri;
		this.$el = $(this.el);
		this.$el.html(this.template(this.contents));
		return this;
	},
	events:{
		'blur #longitude': 'updateLong'
	},
	updateLong: function(){
		alert('yarg');
	}
});