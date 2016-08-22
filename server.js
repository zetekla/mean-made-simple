// modules =====================================================
var express       = require('express'),
  app             = express(),
  path            = require('path'),
  cookieParser    = require('cookie-parser'),
  cors            = require('cors'),
  bodyParser      = require('body-parser'),
  mongoose        = require("mongoose"),
  request         = require('request');

// CONFIGURATION ===============================================
// server port
var port = 3333;

// configuration with middlewares ==============================
// use cors
app.use(cors());

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var dbURI = 'mongodb://localhost:27017/schema_name';
mongoose.connect(dbURI, function (err, db) {
  if (!err) {
    console.log('Connection established to', dbURI);
  }
  else console.dir('Unable to connect to the database Server', err);
});


// =========================== MONGOOSE ==========================
var productModel = mongoose.model('Product', {product: String});

app.get('/list', function(req, res){
  productModel.find(function (err, products) {
    res.send(products);
  });
});

app.post('/add', function (req,res) {
  var product = req.body.product;
  var productDescription = new productModel ({product: product});
  productDescription.save(function(){
    res.send();
  });
});

// render to a client display (pug) simply without Angular
app.get('/display', function(req, res){
  productModel.find(function (err, products) {
    res.render('display', {products: products});
  });
});

// ===============================================================

// =========================== SOAP ==============================

var soapURI = 'http://erp-2/ews/ManexWebService.asmx/GetSalesOrderAndWorkOrder?WorkOrderNo=';
app.post('/work_order',function (req,res) {
  var work_order = req.body.work_order;
  var url = soapURI + work_order;
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body); // Print the json response
      // add further logic here
      res.send(body);
    }
  });
});

app.get('/work_order/:work_order', function (req, res) {
  var work_order = req.params.work_order;
  var url = soapURI + work_order;
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log(body); // Print the json response
      // add further logic here
      res.send(body);
    }
  });
});

// ================================================================
/*
// load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  // body...
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});
*/

app.listen(port);