var myAPIKey = '';
var user_dir="0";
  var testint=0;
var routechoice=0;
var current=0;

function BusInfo (route,stop,eta) {
    this.route = route;
    this.stop =stop;
    this.eta = eta;
}

var West=[];


var East = [];


var North = [];


var South = [];


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
  var Estop=" ";
    var Wstop=" ";
    var Sstop=" ";
    var Nstop=" ";
  
  var Ntime=" ";
  var Nroute=" ";
  var Ndirection=" ";
    var Wtime=" ";
  var Wroute=" ";
  var Wdirection=" ";
    var Stime=" ";
  var Sroute=" ";
  var Sdirection=" ";
    var Etime=" ";
  var Eroute=" ";
  var Edirection=" ";
  
  var default_dir="";
  
  
  console.log('lat2= ' + latitude + ' lon2= ' + longitude);
  //var lat= 49.248523;
  //var long = -123.101606;
  var lat=(''+latitude).substring(0,(""+latitude).indexOf(".")+7);
  var long=(''+longitude).substring(0,(""+longitude).indexOf(".")+7);
  console.log('lati= ' + lat + ' long= ' + long);
  lat= 49.273114;
  long = -123.100348;
   
  req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=' + lat + '&long=' + long + '&radius=500',true);
 // req.open('GET', 'http://api.translink.ca/rttiapi/v1/stops?apikey=M5uO4PdfDGgA0b7TIKjj&lat=49.248523&long=-123.108800&radius=10',true);
  
  function matchRuleShort(str, rule) {
  return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
}
  
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        
      console.log(req.responseText);
        var count=0;
        var temp2="";
        //temp2=(req.responseText).substring((req.responseText).indexOf("<Name>")+6,(req.responseText).indexOf("<Name>")+8);
        temp2=req.responseText;
        console.log('Temp2'+temp2);
        //Maybe this should work for skytrains................
        while ((default_dir!=="EB"&&default_dir!=="WB"&&default_dir!=="SB"&&default_dir!=="NB")&&count<10) {
          
        default_dir=temp2.substring(temp2.indexOf("<Name>")+6,temp2.indexOf("<Name>")+8);
        temp2=temp2.substring(temp2.indexOf("<Name>")+8,temp2.length-1);
        count=count+1;
          console.log('Temp2'+temp2);
        console.log('Default'+default_dir);
        }
        if(user_dir==="0"){
        switch (default_dir){
          case "SB":
            user_dir="1";
            break;
          case "NB":
            user_dir="2";
            break;
          case "EB":
            user_dir="4";
            break;
          case "WB":
            user_dir="3";
            break;
        }
        }
        
          //Estop=(req.responseText).substring((req.responseText).indexOf("<StopNo>")+8,(req.responseText).indexOf("<StopNo>")+13);
        Estop=(req.responseText).substring((req.responseText).indexOf("<Name>EB")-14,(req.responseText).indexOf("<Name>EB")-9);
       console.log('Estop'+Estop+"!");
        Wstop=(req.responseText).substring((req.responseText).indexOf("<Name>WB")-14,(req.responseText).indexOf("<Name>WB")-9);
       console.log('Wstop'+Wstop);
        Sstop=(req.responseText).substring((req.responseText).indexOf("<Name>SB")-14,(req.responseText).indexOf("<Name>SB")-9);
       console.log('Sstop'+Sstop);
        Nstop=(req.responseText).substring((req.responseText).indexOf("<Name>NB")-14,(req.responseText).indexOf("<Name>NB")-9);
       console.log('Nstop'+Nstop);
            /*S=1
  N=2
  W=3
  E=4
  */
        console.log("Direction2:" +user_dir);
        testint=testint+1;
   /////////////EAST    
        if(Estop!=="" && ((user_dir==="0" && default_dir==="EB") || user_dir==="4"))
          {
            console.log('Estop'+Estop+"1");
        req2.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Estop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req2.onload = function () {
        if (req2.readyState === 4) {
      if (req2.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        //Etime=(req2.responseText).substring((req2.responseText).indexOf("<ExpectedCountdown>")+19,(req2.responseText).indexOf("</ExpectedCountdown>"));
        //Eroute=(req2.responseText).substring((req2.responseText).indexOf("<RouteNo>")+9,(req2.responseText).indexOf("</RouteNo>"));
        //Edirection=(req2.responseText).substring((req2.responseText).indexOf("<Direction>")+11,(req2.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req2.responseText);
        console.log("Route"+Eroute);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        
                var Stemp=req2.responseText;
        var check=0;
        while ((Stemp.indexOf("<Direction>")>0)&&check<10)
          {
            check=check+1;
            Etime=Stemp.substring(Stemp.indexOf("<ExpectedCountdown>")+19,Stemp.indexOf("</ExpectedCountdown>"));
            Eroute=Stemp.substring(Stemp.indexOf("<RouteNo>")+9,Stemp.indexOf("</RouteNo>"));
            Edirection=Stemp.substring(Stemp.indexOf("<Direction>")+11,Stemp.indexOf("<Direction>")+12);
            Stemp=Stemp.substring(Stemp.indexOf("<Direction>")+13,Stemp.length-1);
            South.push(new BusInfo("ROUTE: "+ Sroute +" "+Sdirection,"STOP: "+ Sstop,Stime));
          }
        
        
        East.push(new BusInfo("ROUTE: "+ Eroute +" "+Edirection,"STOP: "+ Estop,Etime));
        
                Pebble.sendAppMessage({
          'DIR_KEY': default_dir,
          'S_STOP_KEY': East[current].stop,
          'S_ETA_KEY': East[current].eta,
          'S_ROUTE_KEY': East[current].route,
        });
      }
   }
  };
        req2.send(null);
          }
  /////////////////WEST      
                if(Wstop!=="" && ((user_dir==="0" && default_dir==="WB") ||user_dir==="3"))
          {
        console.log('Wstop'+Wstop+"2");
           req3.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Wstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req3.onload = function () {
        if (req3.readyState === 4) {
      if (req3.status === 200) {
          //<ExpectedCountdown>2</ExpectedCountdown>
        //Wtime=(req3.responseText).substring((req3.responseText).indexOf("<ExpectedCountdown>")+19,(req3.responseText).indexOf("</ExpectedCountdown>"));
        //Wroute=(req3.responseText).substring((req3.responseText).indexOf("<RouteNo>")+9,(req3.responseText).indexOf("</RouteNo>"));
        //Wdirection=(req3.responseText).substring((req3.responseText).indexOf("<Direction>")+11,(req3.responseText).indexOf("<Direction>")+12);
        //<RouteNo>003<Direction></Direction>
          console.log(req3.responseText);
        console.log("Route"+Wroute);
        //console.log('lat3= ' + latitude + ' lon3= ' + longitude);
        
        var Stemp=req3.responseText;
        var check=0;
                while ((Stemp.indexOf("<Direction>")>0)&&check<10)
          {
            check=check+1;
            Wtime=Stemp.substring(Stemp.indexOf("<ExpectedCountdown>")+19,Stemp.indexOf("</ExpectedCountdown>"));
            Wroute=Stemp.substring(Stemp.indexOf("<RouteNo>")+9,Stemp.indexOf("</RouteNo>"));
            Wdirection=Stemp.substring(Stemp.indexOf("<Direction>")+11,Stemp.indexOf("<Direction>")+12);
            Stemp=Stemp.substring(Stemp.indexOf("<Direction>")+13,Stemp.length-1);
            West.push(new BusInfo("ROUTE: "+ Wroute +" "+Wdirection,"STOP: "+ Wstop,Wtime));
          }
        
        
        
                Pebble.sendAppMessage({
          'DIR_KEY': default_dir,
          'S_STOP_KEY': West[current].stop,
          'S_ETA_KEY': West[current].eta,
          'S_ROUTE_KEY': West[current].route,
        });

      }
   }
  };
        req3.send(null);     
          };
  ////////////////SOUTH
                if(Sstop!=="" && ((user_dir==="0" && default_dir==="SB") || user_dir==="1"))
          {
            console.log('Sstop'+Sstop+"3");
                req4.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Sstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req4.onload = function () {
        if (req4.readyState === 4) {
      if (req4.status === 200) {
          
        var Stemp=req4.responseText;
        var check=0;
        while ((Stemp.indexOf("<Direction>")>0)&&check<10)
          {
            check=check+1;
            Stime=Stemp.substring(Stemp.indexOf("<ExpectedCountdown>")+19,Stemp.indexOf("</ExpectedCountdown>"));
            Sroute=Stemp.substring(Stemp.indexOf("<RouteNo>")+9,Stemp.indexOf("</RouteNo>"));
            Sdirection=Stemp.substring(Stemp.indexOf("<Direction>")+11,Stemp.indexOf("<Direction>")+12);
            Stemp=Stemp.substring(Stemp.indexOf("<Direction>")+13,Stemp.length-1);
            South.push(new BusInfo("ROUTE: "+ Sroute +" "+Sdirection,"STOP: "+ Sstop,Stime));
          }
        //Stime=(req4.responseText).substring((req4.responseText).indexOf("<ExpectedCountdown>")+19,(req4.responseText).indexOf("</ExpectedCountdown>"));
        //Sroute=(req4.responseText).substring((req4.responseText).indexOf("<RouteNo>")+9,(req4.responseText).indexOf("</RouteNo>"));
        //Sdirection=(req4.responseText).substring((req4.responseText).indexOf("<Direction>")+11,(req4.responseText).indexOf("<Direction>")+12);
       

        
        
          Pebble.sendAppMessage({
          'DIR_KEY': default_dir,
          'S_STOP_KEY': South[current].stop,
          'S_ETA_KEY': South[current].eta,
          'S_ROUTE_KEY': South[current].route,
        });
      }
   }
  };
        req4.send(null);
          };
  //////////////////NORTH
                if(Nstop!=="" && ((user_dir==="0" && default_dir==="NB") ||user_dir==="2"))
          {
            console.log('Nstop'+Nstop+"4");
            req5.open('GET', 'http://api.translink.ca/rttiapi/v1/stops/'+Nstop+'/estimates?apikey=M5uO4PdfDGgA0b7TIKjj&count=1',true);
        req5.onload = function () {
        if (req5.readyState === 4) {
      if (req5.status === 200) {
          
        
        //Ntime=(req5.responseText).substring((req5.responseText).indexOf("<ExpectedCountdown>")+19,(req5.responseText).indexOf("</ExpectedCountdown>"));
        //Nroute=(req5.responseText).substring((req5.responseText).indexOf("<RouteNo>")+9,(req5.responseText).indexOf("</RouteNo>"));
        //Ndirection=(req5.responseText).substring((req5.responseText).indexOf("<Direction>")+11,(req5.responseText).indexOf("<Direction>")+12);
       
        var Stemp=req5.responseText;
        var check=0;
        while ((Stemp.indexOf("<Direction>")>0)&&check<10)
          {
            check=check+1;
            Ntime=Stemp.substring(Stemp.indexOf("<ExpectedCountdown>")+19,Stemp.indexOf("</ExpectedCountdown>"));
            Nroute=Stemp.substring(Stemp.indexOf("<RouteNo>")+9,Stemp.indexOf("</RouteNo>"));
            Ndirection=Stemp.substring(Stemp.indexOf("<Direction>")+11,Stemp.indexOf("<Direction>")+12);
            Stemp=Stemp.substring(Stemp.indexOf("<Direction>")+13,Stemp.length-1);
            North.push(new BusInfo("ROUTE: "+ Nroute +" "+Ndirection,"STOP: "+ Nstop,Ntime));
          }
        
         
        
        
        
                Pebble.sendAppMessage({
          'DIR_KEY': default_dir,
          'S_STOP_KEY': North[current].stop,
          'S_ETA_KEY': North[current].eta,
          'S_ROUTE_KEY': North[current].route,
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
    req.send(null);
}

function update(stop,eta,route){
  Pebble.sendAppMessage({
          'S_STOP_KEY': stop,
          'S_ETA_KEY': eta,
          'S_ROUTE_KEY': route,
            });
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
    var dict = e.payload;
  var temp=JSON.stringify(dict).substring(JSON.stringify(dict).indexOf("{")+6,JSON.stringify(dict).indexOf("}"));
  if(temp!=='9')
    {
      current=0;
      
      user_dir=temp;
          switch (user_dir)
      {
        case '1':
South=[];
  break;
          case '2':
North=[];
  break;
          case '3':
West=[];
  break;
          case '4':
East=[];
  break;
          
      }
      window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
    }
  else{
      console.log('MIDDLE BUTTON!');
    current=current+1;
    
  /*S=1
  N=2
  W=3
  E=4
  */
    
    switch (user_dir)
      {
        case '1':
    if(current>=South.length){
      current=0;
    }
  //update(South[current].stop,South[current].eta,South[current].route);
  break;
          case '2':
    if(current>=North.length){
      current=0;
    }
  //update(North[current].stop,North[current].eta,North[current].route);
  break;
          case '3':
    if(current>=West.length){
      current=0;
    }
  //update(West[current].stop,West[current].eta,West[current].route);
  break;
          case '4':
    if(current>=East.length){
      current=0;
    }
  //update(East[current].stop,East[current].eta,East[current].route);
  break;

      }
                    window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError,
    locationOptions);
  }
  //testint=dict+"";
  console.log('Got message: ' + JSON.stringify(dict));
  //user_dir=dict;
  console.log(String(user_dir));
  console.log("Direction" +JSON.stringify(user_dir)+"END");
   //console.log(user_dir));
  console.log(e.payload.stop);
  console.log('message!');
    /*S=1
  N=2
  W=3
  E=4
  */



});

Pebble.addEventListener('webviewclosed', function (e) {
  console.log('webview closed');
  console.log(e.type);
  console.log(e.response);
});
