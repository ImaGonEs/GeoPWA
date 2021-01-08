var c = 0;
var userID = Math.floor((Math.random() * 90000) + 10000);
var lat = 0;
var lon = 0;
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

$("#Tracker").on('click', function() {	
   // alert("OSTIA");
    getLocation();
    var t = document.getElementById("Tracker");
    t.style.display = "none";
    c = 1;

    $.ajax({
    type: 'POST',
    url: 'https://blooming-crag-79607.herokuapp.com/GeoAPI/API',
    contentType: 'application/json',
    data: JSON.stringify({"uid": userID, "log": lon, "la": lat}), // access in body
        }).done(function () {
            console.log('SUCCESS');
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
                }).fail(function (msg) {
                    console.log('FAIL');

                }).always(function (msg) {
                    console.log('ALWAYS');
                });
        }
    }, 10000);
    
});