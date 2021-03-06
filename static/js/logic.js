searchUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Perform a GET request to the query URL
d3.json(searchUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});



// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

// funciton to change marker size
function markerSize(magSize) {
    return magSize * 10;
}

// function to change the color of the circle
function chooseColor(magSize) {
    var color = '';
    if (magSize <= 1) {
        color = "green"
    }
    else if (magSize > 1 && magSize <=2) {
        color = 'yellow'
    }
    else if (magSize > 2 && magSize <= 3) {
        color = 'orange'
    }
    else {
        color = 'red'
    }
    return color;
};

function createFeatures(chartData) {
    var quake = L.geoJSON(chartData, {
        pointToLayer: function (chartData, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(chartData.properties.mag),
                fillColor: chooseColor(chartData.properties.mag),
                color: chooseColor(chartData.properties.mag),
                fillOpacity: .75
            });
        }, onEachFeature: onEachFeature

        // var bigQuakes = 
    });

    createMap(quake)

};



function createMap(quake) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: quake
    };


    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, quake]
    });


    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            mags = ["0-1","1.01-2","2.01-3", "< 4"];
      
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(mags[i] +1) + '"></i> ' +
                (mags[i] ? mags[i] + '<br>' : '+');
        }

        return div;

    };

    legend.addTo(myMap);
}
