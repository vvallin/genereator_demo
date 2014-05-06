var map;
var service;
var currentLocation;
var specifiedObject;
var geoPosition;
var directionsDisplay;
var placeName;
var startMarker;
var endMarker;

function directionsInitialise() {
    directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
        center: currentLocation,
        zoom: 15,
        scrollwheel: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(map);
}

function calcRoute() {
    directionsService = new google.maps.DirectionsService();
    var request = {
        origin: currentLocation, 
        destination: specifiedObject.geometry.location, 
        travelMode: google.maps.DirectionsTravelMode.WALKING,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
        console.log(response)

        $('#placeDistance').html(response.routes[0].legs[0].distance.text);
            $('#loader').hide();
    });
};


function handleSearchResults(results, status) {

    var randomIndex = Math.floor((Math.random() * results.length));

    objectId = results[randomIndex].reference;
            
    var request = {
        reference: objectId}

    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, function(place, status)
    {
            console.log(place);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            specifiedObject = place;

            directionsInitialise();
            calcRoute();

            placeName = place.name

            if (placeName.length > 26) {
                $('#placeName').html('<span style="font-size: 80%">'+placeName+'</span>');
            }
            else {
                $('#placeName').html(placeName);    
            }

            $('#placeAddress').html(place.vicinity);

            $('#placePhone').html(place.formatted_phone_number);

            if (typeof place.website !== 'undefined') {
                $('#placeUrl').html('<a href="'+place.website+'" target="_blank">Website</a>')
            }

            $('#shareTwitter').attr('href', 'http://twitter.com/home?status=GenerEator recommended '+placeName+'. Try it yourself: http://genereator.com'
                );
        }
        else {
            alert('No matches found')
        }
    });         
}

function performSearch() 
{
    var request = 
    {
        location: currentLocation,
        radius: '750',
        types: ['restaurant', 'cafe', 'bar']
    };
    service.radarSearch(request, handleSearchResults);
}

function initialise(location) 
{

    currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);

    map = new google.maps.Map(document.getElementById("map-canvas"));
    service = new google.maps.places.PlacesService(map);

    performSearch();
}

function getPosition(){
    $('#loader').show();
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(location) {
            geoPosition = location
            console.log(location)
            $('#loader').hide();
        });
    }
    else 
    {
        alert('This service does not work without geolocation.');
    }
}

$(document).ready(function() {

        $('.mainWrapper').css({
        'height': ''+$(window).height()+''+'px',
        'width': ''+$(window).width()+''+'px'
    });

    getPosition();

    $('#generate').on('click', function() {
        $('#loader').show();
        initialise(geoPosition);
        $('.container').hide();
        $('.searchOptionsRight').hide();
        $('.searchOptionsLeft').hide();
        $('#optionInfo').hide();
        $('.resultMenu').show();
        $('.contentWrapper').show();
        $('#logo').hide();
        $('#placeName').show();
    }); 

    $('#refresh').on('click', function() {
        $('#loader').show();
        performSearch();
    });
	
    $('#infoShow').on('click', function(event) {
        event.preventDefault();
        $('.map').hide();
        $('.resultInfo').show();
        $('#mapShow').show();
        $('#infoShow').hide(); 
    });

    $('#mapShow').on('click', function(event) {
        event.preventDefault();
        $('.resultInfo').hide();
        $('.map').show();
        $('#mapShow').hide();
        $('#infoShow').show(); 
    });
});
