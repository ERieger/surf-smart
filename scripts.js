// ##### VARIABLES #####
var title = document.getElementById('title');
var subtitle = document.getElementById('subtitle');
var weatherIcon = document.getElementById('weatherIcon');
var min = document.getElementById('min');
var max = document.getElementById('max');
var uvInd = document.getElementById('uvInd');
var cTemp = document.getElementById('cTemp');
var forecast = document.getElementById('forecast');
var wind = document.getElementById('wind');
var weatherOutput = document.getElementById('weatherOutput');
var tempOutput = document.getElementById('tempOutput');
var outlook = document.getElementById('outlook');
var uvCall;
var tick = '../images/tick.png';
var pos;

// Patrolled output vars
var patTimes = document.getElementById('patTimes');
var mon = document.getElementById('mon');
var tue = document.getElementById('tue');
var wed = document.getElementById('wed');
var thu = document.getElementById('thu');
var fri = document.getElementById('fri');
var sat = document.getElementById('sat');
var sun = document.getElementById('sun');

// Slideshow vars
var img1 = document.getElementById('img1');
var img2 = document.getElementById('img2');
var img3 = document.getElementById('img3');
var img4 = document.getElementById('img4');
var carousel = document.getElementById('carouselExampleIndicators');

// Search vars
var searchB = document.getElementById('searchB');

// Delete vars
var rmArr = document.getElementById('rmArr');

// Submit Location Variables
var nameInput;
var monC;
var tueC;
var wedC;
var thuC;
var friC;
var satC;
var sunC;
var uLat;
var uLon;

// ****** locData ******
var data = [{
        locId: 001,
        lat: -35.0174034,
        lon: 138.5141832,
        name: 'Brighton Beach',
        patrolled: [5, 6],
        images: ['../images/brightonBeach/001.1.JPG', '../images/brightonBeach/001.2.JPG', '../images/brightonBeach/001.3.JPG', '../images/brightonBeach/001.4.JPG'],
        default: true
    },
    {
        locId: 002,
        lat: -34.980491,
        lon: 138.509287,
        name: 'Glenelg Beach',
        patrolled: [5, 6],
        images: ['../images/glenelgBeach/002.01.JPG', '../images/glenelgBeach/002.02.JPG', '../images/glenelgBeach/002.03.JPG', '../images/glenelgBeach/002.04.JPG'],
        default: true
    },
    {
        locId: 003,
        lat: -35.032746,
        lon: 138.517299,
        name: 'Seacliff Beach',
        patrolled: [5, 6],
        images: ['../images/seacliffBeach/003.1.JPG', '../images/seacliffBeach/003.2.JPG', '../images/seacliffBeach/003.3.JPG', '../images/seacliffBeach/003.4.JPG'],
        default: true
    },
];

if (localStorage.getItem('localData')) {
    data = JSON.parse(localStorage.getItem('localData'))
    console.log(data);
}

// ####### PREP ########
// Hide areas
weatherOutput.style.display = 'none';
tempOutput.style.display = 'none';
carousel.style.display = 'none';
patTimes.style.display = 'none';
title.style.borderBottom = 'none';
rmArr.style.display = 'none';

// ######## MAP ########
// Map setup
var map = L.map('map').setView([-34.9833067, 138.6338448], 11);

// Get map tiles + attribution
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + secret.mapTiler, {
    attribution: '<a href="https://www.mapthttps://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + secret.mapTiler + '.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(map);

var locInMap = L.map('locIn').setView([-35.1505278,138.3285077], 9);

L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + secret.mapTiler, {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
}).addTo(locInMap);

var markers = L.layerGroup();

function updateMarkers() {
    for (let i in data) {
        marker = new L.marker([data[i].lat, data[i].lon])
            .addTo(markers);
        
        marker.on('click', markerClick.bind(null, data[i]));
    }
    markers.addTo(map);
}

function markerClick(markerData) {
    updateData(markerData.locId);
}

updateMarkers();

// #### UPDATE FUNC ####
// Show title, subtitle, tables, etc.
function updateData(id) {
    title.style.borderBottom = '2px solid rgb(48, 212, 178)';
    patTimes.style.display = 'block';
    $('.pInd').remove();

    // Search for parsed location ID in object
    for (var i = 0; i < data.length; ++i) {
        if (data[i].locId == id) {
            
            pos = i;

            title.innerHTML = data[i].name;
            subtitle.innerHTML = 'Weather:'

            // Display areas
            weatherOutput.style.display = 'block';
            tempOutput.style.display = 'block';

            if (data[i].images == false) {
                console.log('no images.');
                carousel.style.display = 'none';

            } else {
                carousel.style.display = 'block';

                // Add images to slidewhow
                img1.setAttribute('src', data[i].images[0]);
                img2.setAttribute('src', data[i].images[1]);
                img3.setAttribute('src', data[i].images[2]);
                img4.setAttribute('src', data[i].images[3]);
                // Show slider
            }

            // Show / hide delete button for default / user inputed points
            if (data[i].default == true) {
                rmArr.style.display = 'none';
            } if (data[i].default == false) {
                rmArr.style.display = 'block';
            }

            // Concatenate API call URL
            var apiCall = 'http://api.openweathermap.org/data/2.5/weather?lat=' + data[i].lat + '&lon=' + data[i].lon + '&units=metric&appid=' + secret.openWeather;
            uvCall = 'http://api.openweathermap.org/data/2.5/uvi?appid=' + secret.openWeather + '=' + data[i].lat + '&lon=' + data[i].lon;

            // Call API using var apiCall, then parse JSON object into function
            $.getJSON(apiCall, weatherCallback);

            for (var x = 0; x < data[i].patrolled.length; ++x) {
                if (data[i].patrolled[x] == 0) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    mon.appendChild(img);
                }
                if (data[i].patrolled[x] == 1) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    tue.appendChild(img);
                }
                if (data[i].patrolled[x] == 2) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    wed.appendChild(img);

                }
                if (data[i].patrolled[x] == 3) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    thu.appendChild(img);
                }
                if (data[i].patrolled[x] == 4) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    fri.appendChild(img);
                }
                if (data[i].patrolled[x] == 5) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    sat.appendChild(img);
                }
                if (data[i].patrolled[x] == 6) {
                    var img = document.createElement('img');
                    img.setAttribute('class', 'pInd');
                    img.src = tick;
                    sun.appendChild(img);
                }
            }
        }
    }
}

// Access open weather API and add retrieved data to display on page
function weatherCallback(weatherData) {
    // Take icon code from object and access icon from open weather API cloud
    var imgCall = 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '.png';
    // Show weather icon
    weatherIcon.setAttribute('src', imgCall);

    // Update page to include weather
    outlook.innerHTML = weatherData.weather[0].description;
    cTemp.innerHTML = `${Math.round(weatherData.main.temp)}°C`;
    forecast.innerHTML = weatherData.weather[0].description;
    wind.innerHTML = `${Math.round(weatherData.wind.speed)} Km/h`;
    min.innerHTML = `${Math.round(weatherData.main.temp_min)}°C`;
    max.innerHTML = `${Math.round(weatherData.main.temp_max)}°C`;

    // Call API using var apiCall, then parse JSON object into function
    $.getJSON(uvCall, uvCallBack);
}

// Access open weather API UV INDEX and display on page
function uvCallBack(uvData) {
    // Display UV INDEX
    uvInd.innerHTML = Math.round(uvData.value);
}

function search() {
    var sQuery = prompt("Search for location.\nPlease enter a valid location", "Brighton Beach");

    for (var i = 0; i < data.length; ++i) {
        if (data[i].name.toLowerCase() == sQuery.toLowerCase() || data[i].name.replace(" Beach", "").toLowerCase() == sQuery.toLowerCase()) {
            updateData(data[i].locId);
        }
    }
}

/* Open when someone clicks on the span element */
function openAdd() {
    document.getElementById("myNav").style.width = "100%";
}

/* Close when "x" is symbol clicked inside the overlay */
function closeAdd() {
    document.getElementById("myNav").style.width = "0%";
}

// Create draggable marker for location input
var uLocIn = L.marker(new L.LatLng(-35.1563172, 138.4383242), {
    draggable: true,
    autoPan: true
}).addTo(locInMap);

// Update lat lon vars for custom location
uLocIn.on('dragend', function () {
    uLat = uLocIn.getLatLng().lat;
    uLon = uLocIn.getLatLng().lng;
});

// Submit user location
function submitLocation() {
    // Get the location variables
    nameInput = document.getElementById('nameInput').value;
    monC = document.getElementById('monC').checked;
    tueC = document.getElementById('tueC').checked;
    wedC = document.getElementById('wedC').checked;
    thuC = document.getElementById('thuC').checked;
    friC = document.getElementById('friC').checked;
    satC = document.getElementById('satC').checked;
    sunC = document.getElementById('sunC').checked;

    // Define patrolled day array
    var patrolledIn = [];

    // Logic to determine what days the beach is patrolled
    if (monC == true) {
        patrolledIn.push(0);
    } if (tueC == true) {
        patrolledIn.push(1);
    } if (wedC == true) {
        patrolledIn.push(2);
    } if (thuC == true) {
        patrolledIn.push(3);
    } if (friC == true) {
        patrolledIn.push(4);
    } if (satC == true) {
        patrolledIn.push(5);
    } if (sunC == true) {
        patrolledIn.push(6);
    }

    // Push the user location to the array
    data.push({
        locId: data.length + 1,
        lat: uLat,
        lon: uLon,
        name: nameInput,
        patrolled: patrolledIn,
        images: false,
        default: false
    });

    // 
    localStorage.setItem('localData',JSON.stringify(data)); 

    closeAdd();

    // Clear markers
    markers.clearLayers();

    // Update all markers
    updateMarkers();
}

function deleteOb() {
    data.splice(pos, 1);
    localStorage.setItem('localData',JSON.stringify(data)); 
    markers.clearLayers();
    updateMarkers();
}
