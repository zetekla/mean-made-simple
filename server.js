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

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');
app.use(express.static(__dirname + '/views'));

var dbURI = 'mongodb://localhost:27017/schema_name';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI, function (err, db) {
  if (!err) {
    console.log('Connection established to', dbURI);
  }
  else console.dir('Unable to connect to the database Server', err);
});


// =========================== MONGOOSE ==========================
var productModel = mongoose.model('Product', {product: String, description: String});

app.get('/', function(req, res, next){
  res.render('index');
});

app.get('/list', function(req, res){
  productModel.find(function (err, body) {
    if (err) {
      return res.send(err);
    }
    res.send(body);
  });
});

app.route('/products')
  .get(productList)
  .post(productCreate);
app.route('/products/:id')
  .get(productRead)
  .put(productUpdate)
  .delete(productDelete);


app.post('/add', productCreate);

// SELECT * to list all records, get method

function productList (req, res){
  productModel.find(function (err, body) {
    if (err) {
      return res.send(err);
    }
    res.json(body);
  });
}

// INSERT, post|put method (CREATE OR UPDATE)

function productCreate(req,res) {
  productModel.findOneAndUpdate({ product: req.body.product}, { description: req.body.description}, {new: true}, function(err, body){
    if (err) throw res.json(err);
    if (body) res.json(body);
    else {
      var product = new productModel (req.body);
      product.save(function(err, body){
        if (err) {
          throw err;
        } else {
          res.json(body);
        }
      });
    }
  });
}

// SELECT a record, get method
function productRead(req,res) {
  productModel.find( { _id : req.params.id } , function (err, body){
    if (err) {
      throw res.send(err);
    }
    console.log(body);
    res.json(body);
  });

  /*productModel.findById( req.params.id , function (err, body){
    if (err) {
      throw res.send(err);
    }
    console.log(body);
    res.json(body);
  });*/
}

// UPDATE, put|patch method
function productUpdate(req,res) {
  console.log(req.body);

  productModel.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, product) {
    if (err) throw err;
    res.json({ info: 'product updated', product: product});
  });
}

// DELETE, delete method
function productDelete(req,res) {
  productModel.findByIdAndRemove(req.params.id, function(err){
    if (err) throw err;
    res.json('product deleted!');
  });
}

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
      console.log(body); // Print the json response
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
app.on('error', onError);
app.on('listening', onListening);
console.log('listening on port', port);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
