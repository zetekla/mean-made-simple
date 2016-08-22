// modules =====================================================
var express       = require('express'),
  app             = express(),
  cookieParser    = require('cookie-parser'),
  cors            = require('cors'),
  bodyParser      = require('body-parser'),
  mongoose        = require("mongoose");

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

var dbURI = 'mongodb://localhost:27017/schema_name';
mongoose.connect(dbURI, function (err, db) {
  if (!err) {
    console.log('Connection established to', dbURI);
  }
  else console.dir('Unable to connect to the database Server', err);
});

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

/*
// load all files in models dir
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
  // body...
  if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});
*/

app.listen(port);