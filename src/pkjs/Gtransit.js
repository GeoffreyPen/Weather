var myAPIKey = '';

function iconFromTRANSITId(TRANSITId) {
  if (TRANSITId < 600) {
    return 2;
  } else if (TRANSITId < 700) {
    return 3;
  } else if (TRANSITId > 800) {
    return 1;
  } else {
    return 0;
  }
}

function fetchTRANSIT(latitude, longitude) {
  var req = new XMLHttpRequest();
  var req2 = new XMLHttpRequest();
  var req3 = new XMLHttpRequest();
  var req4 = new XMLHttpRequest();
  var req5 = new XMLHttpRequest();
  var Estop="";
    var Wstop="";
    var Sstop="";
    var Nstop="";
  var time="";
  var route="";
  var direction="";
  var default_dir="";
  console.log('lat2= ' + latitude + ' lon2= ' + longitude);
  //var lat= 49.248523;
  //var long = -123.101606;
  var lat=(''+latitude).substring(0,(""+latitude).indexOf(".")+7);
  var long=(''+longitude).substring(0,(""+longitude).indexOf(".")+7);
  console.log('lati= ' + lat + ' long= ' + long);
  req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=' + lat + '&long=' + long + '&radius=100',true);
 // req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=49.248523&long=-123.108800&radius=10',true);
  
  
  
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        
      console.log(req.responseText);
        default_dir=(req.responseText).substring((req.responseText).indexOf("<Name>")+6,(req.responseText).indexOf("<Name>")+8);
        console.log('Default'+default_dir);
        Pebble.sendAppMessage({
        'DIR_KEY': default_dir,
        });
          //Estop=(req.responseText).substring((req.responseText).indexOf("<StopNo>")+8,(req.responseText).indexOf("<StopNo>")+13);
        Estop=(req.responseText).substring((req.responseText).indexOf("<Name>EB")-14,(req.responseText).indexOf("<Name>EB")-9);
       console.log('Estop'+Estop+"!");
        Wstop=(req.responseText).substring((req.responseText).indexOf("<Name>WB")-14,(req.responseText).indexOf("<Name>WB")-9);
       console.log('Wstop'+Wstop);
        Sstop=(req.responseText).substring((req.responseText).indexOf("<Name>SB")-14,(req.responseText).indexOf("<Name>SB")-9);
       console.log('Sstop'+Sstop);
        Nstop=(req.responseText).substring((req.responseText).indexOf("<Name>NB")-14,(req.responseText).indexOf("<Name>NB")-9);
       console.log('Nstop'+Nstop);
   /////////////EAST    
        if(Estop!=="")
          {
            console.log('Estop'+Estop+"1");
        req2.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Estop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req2.onload = function () {
        if (req2.readyState === 4) {
      if (req2.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        time=(req2.responseText).substring((req2.responseText).indexOf("<ExpectedCountdown>")+19,(req2.responseText).indexOf("</ExpectedCountdown>"));
        route=(req2.responseText).substring((req2.responseText).indexOf("<RouteNo>")+9,(req2.responseText).indexOf("</RouteNo>"));
        direction=(req2.responseText).substring((req2.responseText).indexOf("<Direction>")+11,(req2.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req2.responseText);
        console.log("Route"+route);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        Pebble.sendAppMessage({
          //'TRANSIT_ICON_KEY': icon,
          
//http://api.translink.ca/rttiapi/v1/stops/60980/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1
          
          'E_STOP_KEY': "STOP: "+ Estop,
          'E_ETA_KEY': time,
          'E_ROUTE_KEY': "ROUTE: "+ route +" "+direction,
          //console.log(TRANSIT_ROUTE_KEY);
          //'TRANSIT_stop_KEY': latitude,
          //'TRANSIT_CITY_KEY': longitude
        });
      }
   }
  };
        req2.send(null);
          };
  /////////////////WEST      
                if(Wstop!=="")
          {
        console.log('Estop'+Estop+"2");
           req3.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Wstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req3.onload = function () {
        if (req3.readyState === 4) {
      if (req3.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        time=(req3.responseText).substring((req3.responseText).indexOf("<ExpectedCountdown>")+19,(req3.responseText).indexOf("</ExpectedCountdown>"));
        route=(req3.responseText).substring((req3.responseText).indexOf("<RouteNo>")+9,(req3.responseText).indexOf("</RouteNo>"));
        direction=(req3.responseText).substring((req3.responseText).indexOf("<Direction>")+11,(req3.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req3.responseText);
        console.log("Route"+route);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        Pebble.sendAppMessage({
          //'TRANSIT_ICON_KEY': icon,
          
//http://api.translink.ca/rttiapi/v1/stops/60980/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1
          
          'W_STOP_KEY': "STOP: "+ Wstop,
          'W_ETA_KEY': time,
          'W_ROUTE_KEY': "ROUTE: "+ route +" "+direction,
          //console.log(TRANSIT_ROUTE_KEY);
          //'TRANSIT_stop_KEY': latitude,
          //'TRANSIT_CITY_KEY': longitude
        });
      }
   }
  };
        req3.send(null);     
          };
  ////////////////SOUTH
                if(Sstop!=="")
          {
            console.log('Estop'+Estop+"3");
                req4.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Sstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req4.onload = function () {
        if (req4.readyState === 4) {
      if (req4.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        time=(req4.responseText).substring((req4.responseText).indexOf("<ExpectedCountdown>")+19,(req4.responseText).indexOf("</ExpectedCountdown>"));
        route=(req4.responseText).substring((req4.responseText).indexOf("<RouteNo>")+9,(req4.responseText).indexOf("</RouteNo>"));
        direction=(req4.responseText).substring((req4.responseText).indexOf("<Direction>")+11,(req4.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req4.responseText);
        console.log("Route"+route);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        Pebble.sendAppMessage({
          //'TRANSIT_ICON_KEY': icon,
          
//http://api.translink.ca/rttiapi/v1/stops/60980/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1
          
          'S_STOP_KEY': "STOP: "+ Sstop,
          'S_ETA_KEY': time,
          'S_ROUTE_KEY': "ROUTE: "+ route +" "+direction,
          //console.log(TRANSIT_ROUTE_KEY);
          //'TRANSIT_stop_KEY': latitude,
          //'TRANSIT_CITY_KEY': longitude
        });
      }
   }
  };
        req4.send(null);
          };
  //////////////////NORTH
                if(Nstop!=="")
          {
            console.log('Estop'+Estop+"4");
          req5.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Nstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req5.onload = function () {
        if (req5.readyState === 4) {
      if (req5.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        time=(req5.responseText).substring((req5.responseText).indexOf("<ExpectedCountdown>")+19,(req5.responseText).indexOf("</ExpectedCountdown>"));
        route=(req5.responseText).substring((req5.responseText).indexOf("<RouteNo>")+9,(req5.responseText).indexOf("</RouteNo>"));
        direction=(req5.responseText).substring((req5.responseText).indexOf("<Direction>")+11,(req5.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req5.responseText);
        console.log("Route"+route);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        Pebble.sendAppMessage({     
          'N_STOP_KEY': "STOP: "+ Nstop,
          'N_ETA_KEY': time,
          'N_ROUTE_KEY': "ROUTE: "+ route +" "+direction,
        });
      }
   }
  };
        req5.send(null);
          };
  /////////////////////
      
      }
}
  };
  //http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=49.248523&long=-123.108800&radius=500
    req.send(null);
   //     var response = JSON.parse(req.responseText);
   //     var stop = Math.round(response.main.temp - 273.15);
   //     var icon = iconFromTRANSITId(response.TRANSIT[0].id);
   //     var city = response.name;
    //    console.log(stop);
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
  fetchTRANSIT(coordinates.latitude, coordinates.longitude);
}

function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  Pebble.sendAppMessage({
    'TRANSIT_ETA_KEY': 'Loc Unavailable',
    'TRANSIT_STOP_KEY': 'N/A'
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
  console.log(e.payload.stop);
  console.log('message!');
});

Pebble.addEventListener('webviewclosed', function (e) {
  console.log('webview closed');
  console.log(e.type);
  console.log(e.response);
});
