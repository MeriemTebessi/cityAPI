const express = require('express');
const app = express();
const request = require('request');

app.use(express.json());

app.get((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.get('/v1/', (req, res, next) => {
  res.send({message : 'Welcome. API Version v1 - 1.0.0 - Author: Meriem Tebessi'});
});

app.get('/v1/city', (req, res, next) => {
  let slatitude = req.query.latitude;
  let slongitude = req.query.longitude;

  if ((slatitude == undefined)||(slongitude == undefined)){
	  res.status(400).json({
		  "message": "Bad Request. Latitude and longitude parameters are required. Please try again using this example: GET /v1/city?latitude=22.0&longitude=120.12"
	  });
  }else{
	  let surl = "https://secure.geonames.org/findNearbyPlaceNameJSON?lat="+slatitude+"&lng="+slongitude+"&username=meri";
	  let url = new URL (surl);
	  request({
		  url: url,
		  method: 'GET'	  }, function (error, response, body){
		  if (!error){
			  var resp = JSON.parse(body);
			  res.status(200).json({						
											"latitude": slatitude,
											"longitude": slongitude,
											"city": resp.geonames[0].name,
											"pays": resp.geonames[0].countryCode												
									}); // fin déclaration de la réponse 200
		  }//fin if
		  else {
			  res.status(500).json({
				  "message": "désolé, une erreur technique est parvenue."
			  });			  
			  };// fin else de controle sur l'erreur de reponse de api externe
		  });	    
   }; // fin else sur le controle des params mandatory	  		  
});

  app.use((req, res) => {
    res.json({ message: "Bienvenue" }); 
 });

module.exports = app;

// /v1/adhanTimes?city= &?country=