var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('express-validator');
const request = require('request');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req,res,next){
    res.locals.errors = null;
    next();
})

app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

console.log('node.js application starting...');

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

var options = {
  headers: {
      'Authorization': 'Basic R1dTL1BDQ01PQkxFOk1vYmlsZTIwMTY=, Token tvlport_app_id=travelportAPI-AqDxslUiTZ028olU4KyTJf95'
   } 
};

app.post('/search', function(req, res) {
  console.log(req.body);
  var tripServicesUrl = 'https://adc-api-np.travelport.com/hotel/shop/v3/properties?';
  req.check('city', 'City is required').notEmpty();
  req.check('state', 'State is required').len(2,2);
  req.check('country', 'Country is required').len(2,2);
  req.check('sdate', 'Check-In is required').len(8,8);
  req.check('edate', 'Check-Out is required').len(8,8);
  req.check('guests', 'Number of guests is required').notEmpty();
     
  var errors = req.validationErrors();
  if(errors){
      res.render('pages/index',{
          topicHead : 'Hackathon',
          errors : errors
      });
  }
  else{
    //Assign the request body elements to local variables
    var sdate = req.body.sdate;
    var edate = req.body.edate;
  	var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    
    var guests = req.body.guests;
    
    //Print the values to ensure proper binding
    console.log(city+', '+state+', '+country+', '+sdate+', '+edate+', '+guests);
    //Map the variable from the request to the outgoing url
    tripServicesUrl += 'checkinDate='+sdate;
    tripServicesUrl += '&checkoutDate='+edate;
    tripServicesUrl +=  '&numberOfGuests='+guests;
    tripServicesUrl += '&radius=3';
    tripServicesUrl += '&city='+city;
    tripServicesUrl += '&state='+state;
    tripServicesUrl += '&country='+country;
    
    console.log(tripServicesUrl);
request(tripServicesUrl, options, function (req2, res2) {
  var json = JSON.parse(res2.body);
  console.log(json.Properties.PropertyInfo);
  var jSolutions = json.Properties.PropertyInfo;
  res.render('pages/response', {
            solutions: jSolutions
});
});
  }
});

app.listen(9000);
console.log('Node HTTP server is listening');
 