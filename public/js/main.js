var c = 0;
var userID = Math.floor((Math.random() * 90000) + 10000);
var lat = 0;
var lon = 0;
var mp = 0;
window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}
window.onbeforeunload = confirmExit;
function confirmExit()
{
   
    if(c === 1) {
            $.ajax({
            type: 'DELETE',
            url: 'https://blooming-crag-79607.herokuapp.com/GeoAPI/API/'+ userID,
            contentType: 'application/json',
                data: JSON.stringify({"uid": userID, "log": -11, "la": 11}), // access in body
                }).done(function () {
                    console.log('SUCCESS');
                }).fail(function (msg) {
                    console.log('FAIL');

                }).always(function (msg) {
                    console.log('ALWAYS');
                });
        c = 2;
           }
    return "Your tracking has been deleted. Reload the app if you want to share your location again (or just exit!).";
}
/*$.post("http://localhost:8001/GeoAPI/API/", function( JSON.stringify({ uid: 22222, log: -11, la: -11}) ) {
   alert("succ")
});*/

/*$.ajax({
    type: 'PUT',
    url: 'http://localhost:8001/GeoAPI/API/22222',
    contentType: 'application/json',
    data: JSON.stringify({"uid": 22222, "log": -11, "la": 11}), // access in body
}).done(function () {
    console.log('SUCCESS');
}).fail(function (msg) {
    console.log('FAIL');
    
}).always(function (msg) {
    console.log('ALWAYS');
});*/





function getLocation() {
    if(navigator.geolocation) {
        position = navigator.geolocation.getCurrentPosition(showPosition);
    }

}
function showPosition(position) {

    lon = position.coords.longitude

    lat = position.coords.latitude
}

function initMap() {
    
    
    
    
    map = new OpenLayers.Map("Map");
    map.addLayer(new OpenLayers.Layer.OSM());

    var lonLat = new OpenLayers.LonLat( lon ,lat )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
          );
          
    var zoom=16;

    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
    
    markers.addMarker(new OpenLayers.Marker(lonLat));
    
    map.setCenter (lonLat, zoom);
    var m = document.getElementById("Map");
    m.style.border = "3px solid #FFFFFF";
    return map;
      }


$("#Tracker").on('click', function() {	
   // alert("OSTIA");
    getLocation();
    var t = document.getElementById("Tracker");
    var p = document.getElementById("TText");
    var lonLat = 0;
    
    
    
    t.style.display = "none";
    p.textContent = "You are being tracked! Your personal ID: "+userID;
    
    //m.style.border-radius = "25px";
    c = 1;
    
    //$("TText").text("You are being tracked! Your personal ID: "+userID);
    
    $.ajax({
    type: 'POST',
    url: 'https://blooming-crag-79607.herokuapp.com/GeoAPI/API',
    contentType: 'application/json',
    data: JSON.stringify({"uid": userID, "log": lon, "la": lat}), // access in body
        }).done(function () {
            console.log('SUCCESS');
            mp = initMap();
        }).fail(function (msg) {
            console.log('FAIL');

        }).always(function (msg) {
            console.log('ALWAYS');
        });
    
    setInterval(function() {
        getLocation();
        if(c!= 2) {
            $.ajax({
            type: 'PUT',
            url: 'https://blooming-crag-79607.herokuapp.com/GeoAPI/API/'+ userID,
            contentType: 'application/json',
                data: JSON.stringify({"uid": userID, "log": lon, "la": lat}), // access in body
                }).done(function () {
                    console.log('SUCCESS');
                    lonLat = new OpenLayers.LonLat( lon ,lat )
                          .transform(
                            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                            map.getProjectionObject() // to Spherical Mercator Projection
                          );                
                    mp.setCenter(lonLat, 16);

                }).fail(function (msg) {
                    console.log('FAIL');

                }).always(function (msg) {
                    console.log('ALWAYS');
                });
        }
    }, 10000);
    
});

