var app;
$(document).ready(function(){
	app = new App;
});

var App = function(){
	this.init();
	this.height = $(window).height();
	$('#map').css('height',this.height+'px')
}
App.prototype.init = function(){
//34.0659, -117.7896
var latlng = new google.maps.LatLng(34.0659, -117.7896);
var myoptions = {
    zoom: 10,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    streetViewControl: false,
};
var map = new google.maps.Map(document.getElementById("map"), myoptions);
}
App.prototype.getData = function(){
	$.getJSON('data/data.json',function(d){
		var meta = d.meta.view;
		var data = d.data;
		var colKeys = [];
		$.each(meta.columns,function(i,x){
			//
		})

	})
}