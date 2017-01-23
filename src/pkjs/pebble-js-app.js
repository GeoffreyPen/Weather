var myAPIKey = '';

function iconFromWeatherId(weatherId) {
  if (weatherId < 600) {
    return 2;
  } else if (weatherId < 700) {
    return 3;
  } else if (weatherId > 800) {
    return 1;
  } else {
    return 0;
  }
}

function fetchWeather(latitude, longitude) {
  var req = new XMLHttpRequest();
  console.log('lat2= ' + latitude + ' lon2= ' + longitude);
  var lat= 49.248523;
  var long = -123.101606;
  //var lat=(''+latitude).substring(0,(""+latitude).indexOf(".")+7);
  //var long=(''+longitude).substring(0,(""+longitude).indexOf(".")+7);
  console.log('lati= ' + lat + ' long= ' + long);
  req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=' + lat + '&long=' + long + '&radius=10',true);
 // req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=49.248523&long=-123.108800&radius=10',true);
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        console.log(req.responseText);
          console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        Pebble.sendAppMessage({
          //'WEATHER_ICON_KEY': icon,
          'WEATHER_TEMPERATURE_KEY': latitude,
          'WEATHER_CITY_KEY': longitude
        });
      }
   }
  };
  //http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=49.248523&long=-123.108800&radius=500
    req.send(null);
   //     var response = JSON.parse(req.responseText);
   //     var temperature = Math.round(response.main.temp - 273.15);
   //     var icon = iconFromWeatherId(response.weather[0].id);
   //     var city = response.name;
    //    console.log(temperature);
    //    console.log(icon);
    //    console.log(city);

      //} else {
       // console.log('Error');
      //}
    //}
  //};
  //req.send(null);
}

function locationSuccess(pos) {
  var coordinates = pos.coords;
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  fetchWeather(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  Pebble.sendAppMessage({
    'WEATHER_CITY_KEY': 'Loc Unavailable',
    'WEATHER_TEMPERATURE_KEY': 'N/A'
  });
}

var locationOptions = {
  'timeout': 15000,
  'maximumAge': 60000
};

Pebble.addEventListener('ready', function (e) {
  console.log('connect!' + e.ready);
  window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
  console.log(e.type);
});

Pebble.addEventListener('appmessage', function (e) {
  window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
  console.log(e.type);
  console.log(e.payload.temperature);
  console.log('message!');
});

Pebble.addEventListener('webviewclosed', function (e) {
  console.log('webview closed');
  console.log(e.type);
  console.log(e.response);
});
