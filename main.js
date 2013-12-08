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
this.geocoder = new google.maps.Geocoder();
this.map = new google.maps.Map(document.getElementById("map"), myoptions);
this.getData();
//alright some static places we made and cache since they dont change....
this.geos = [{"latlon":[34.2504595,-118.43383449999999],"query":"Arroyo+Seco,+Los+Angeles,+CA","name":"Arroyo Seco"},{"latlon":[34.2504595,-118.43383449999999],"query":"Atwater+Village,+Los+Angeles,+CA","name":"Atwater Village"},{"latlon":[34.2504595,-118.43383449999999],"query":"Bel+Air-Beverly+Crest,+Los+Angeles,+CA","name":"Bel Air-Beverly Crest"},{"latlon":[34.0910163,-118.43907039999999],"query":"Boyle+Heights,+Los+Angeles,+CA","name":"Boyle Heights"},{"latlon":[34.0297895,-118.21172569999999],"query":"CANNDU,+Los+Angeles,+CA","name":"CANNDU"},{"latlon":[34.0297895,-118.21172569999999],"query":"Canoga+Park,+Los+Angeles,+CA","name":"Canoga Park"},{"latlon":[34.208254,-118.60586089999998],"query":"Central+Alameda,+Los+Angeles,+CA","name":"Central Alameda"},{"latlon":[33.9972599,-118.2497386],"query":"Central+Hollywood,+Los+Angeles,+CA","name":"Central Hollywood"},{"latlon":[34.0686748,-118.32281649999999],"query":"Central+San+Pedro,+Los+Angeles,+CA","name":"Central San Pedro"},{"latlon":[33.7322884,-118.29358910000002],"query":"Chatsworth,+Los+Angeles,+CA","name":"Chatsworth"},{"latlon":[34.2506356,-118.61481000000003],"query":"Coastal+San+Pedro,+Los+Angeles,+CA","name":"Coastal San Pedro"},{"latlon":[33.7172607,-118.3023579],"query":"Del+Rey,+Los+Angeles,+CA","name":"Del Rey"},{"latlon":[34.0412085,-118.44259599999998],"query":"Encino,+Los+Angeles,+CA","name":"Encino"},{"latlon":[33.7906551,-118.2965084],"query":"Harbor+Gateway+North,+Los+Angeles,+CA","name":"Harbor Gateway North"},{"latlon":[34.1063307,-118.2848199],"query":"MacArthur+Park,+Los+Angeles,+CA","name":"MacArthur Park"},{"latlon":[34.187044,-118.3812562],"query":"Northridge+South,+Los+Angeles,+CA","name":"Northridge South"},{"latlon":[34.0556887,-118.3797955],"query":"Pico+Union,+Los+Angeles,+CA","name":"Pico Union"},{"latlon":[34.215835,-118.38179919999999],"query":"Sylmar,+Los+Angeles,+CA","name":"Sylmar"},{"latlon":[34.0326464,-118.31944679999998],"query":"West+Los+Angeles+,+Los+Angeles,+CA","name":"West Los Angeles "},{"latlon":[34.2048586,-118.57396210000002],"query":"Woodland+Hills-Warner+Center,+Los+Angeles,+CA","name":"Woodland Hills-Warner Center"}];
}
App.prototype.cacheGeos = function(){
	var that = this;
	var locations = [];
	var successCount = 0;
	var sI = setInterval(function(){
	//$.each(places,function(i,x){
		//if(i == 0){
			that.geocoder.geocode( { 'address': places[successCount]}, function(results, status) {
			  successCount++;
		      if (status == google.maps.GeocoderStatus.OK) {
		        //map.setCenter(results[0].geometry.location);
		        //var marker = new google.maps.Marker({
		        //    map: map,
		        //    position: results[0].geometry.location
		        //});
				var l = {latlon:[results[0].geometry.location.pb,results[0].geometry.location.qb],query:places[successCount],name:placeNames[successCount]};
				console.log('result',results,l);
				locations.push(l);
		      } else {
		        alert("Geocode was not successful for the following reason: " + status);
		      }
		      if(successCount == places.length-1){
		      	//done
		      	clearInterval(sI);
		      	that.makeHeatmap(colKeys,data,places,locations);
		      }
		    });
		    
		//}
	//})
	},100);
}
App.prototype.getData = function(){
	var that = this;
	$.getJSON('data/data.json',function(d){
		var meta = d.meta.view;
		var data = d.data;
		var colKeys = [];
		$.each(meta.columns,function(i,x){
			colKeys.push(x.name);
		})
		console.log('colkeys',colKeys);
		var places = [];//temp arr of all places
		var placeNames = []; //formal riffraff
		$.each(data,function(i,x){
			
			if($.inArray(x[10],placeNames) == -1){
				var o = x[10];
				places.push(x[10].replace(/ /g,'+')+',+Los+Angeles,+CA');
				placeNames.push(x[10]);
			}
		})
		console.log('places',placeNames)
		//only use this once in awhile.... 
		//wouldnt it be nice to get an actual latlon from your API LA city APIs???
		//this.cacheGeos(places,placeNames);
		
		that.makeHeatmap(colKeys,data,placeNames,that.geos);
	})
}
App.prototype.makeHeatmap = function(colKeys,data,places,locations){
	//console.log('makeheat',colKeys,data,places,locations);
	//ok lets cache some static places...
	//console.log(JSON.stringify(locations));
	/*$.each(data,function(i,x){
		if(x)
	})*/
	var that = this;
	console.log('l',places.length,locations.length);
	var min, max;//holds vals for scale
	$.each(data,function(i,x){
		$.each(locations,function(ii,loc){
			if(loc.name == x[10]){
				if(typeof loc.vals == "undefined") {
					loc.vals = [];
					loc.dates = [];
					loc.categories = [];
					loc.tasks = [];
					loc.vendors = [];
				}
				if(typeof min == "undefined"){
					min = parseFloat(x[16]);
					max = parseFloat(x[16]);
				}
				if(parseFloat(x[16]) < min) min = parseFloat(x[16]);
				if(parseFloat(x[16]) > max) max = parseFloat(x[16]);
				loc.vals.push(x[16]);
				loc.categories.push(x[14]);
				loc.dates.push(x[11]);
				loc.tasks.push(x[15]);
				loc.vendors.push(x[13]);
			}
		})
	});
	console.log('locs',locations);
	that.heatMaps = [];
	that.allheat = [];
	var heatmap = new HeatCanvasOverlayView(that.map, {'step':0.3, 'degree':HeatCanvas.QUAD, 'opacity':0.8});
	$.each(locations,function(i,x){
		var block = $('<div class="markerblock">Expenditures for '+x.name+'<ul></ul></div>');
		
		/*var marker = new google.maps.Marker({
	        map: that.map,
	        position: new google.maps.LatLng(x.latlon[0],x.latlon[1])
        });*/
		$.each(x.vals,function(ii,val){
			//that.allheat.push([x.latlon[0],x.latlon[1],val]);
			$('ul',block).append('<li><span>$'+val+'</span><small>Dates:</small>'+x.dates[ii]+', <span><small>Info: </small>'+x.categories[ii]+', '+x.tasks[ii]+'</span><span><small>Vendor: </small>'+x.vendors[ii]+'</span></li>')
			heatmap.pushData(x.latlon[0],x.latlon[1],that.rangeMap(val,min,max,150,300));
		})
		var infowindow = new google.maps.InfoWindow({
		      content: $(block).html()
		  });

		  var marker = new google.maps.Marker({
		      position: new google.maps.LatLng(x.latlon[0],x.latlon[1]),
		      map: that.map,
		      title: x.name
		  });
		  google.maps.event.addListener(marker, 'click', function() {
		    infowindow.open(that.map,marker);
		  });
	})
	

}
//range/scale method from processing.js, RIP my old friend. Way lighter than d3 for scale/range.......
App.prototype.rangeMap = function(value, istart, istop, ostart, ostop) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart))
};