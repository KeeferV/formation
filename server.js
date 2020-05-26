var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var products = require('./models/products.js');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/database', {
  "useNewUrlParser": true,
  "useFindAndModify": false,
  "useUnifiedTopology": true
})
mongoose
    .connection
    .on('connected', function () {
      console.log('Mongoose default connection open to db')
    });
mongoose
    .connection
    .on('error', function (err) {
      console.log(`Mongoose default connection error:${err}`)
    })

var schemaProducts = new mongoose.Schema({
  "name": "String",
  "description": "String",
  "USD_price": "Decimal128",
  "EUR_price": "Decimal128",
  "file_link": "String",
  "creation_date": "Date",
  "orders_counter": "Number"
});
var schemaUsers = new mongoose.Schema({
  "email": "String",
  "password": "String"
});
var Products = mongoose.model('Products', schemaProducts)
var Users = mongoose.model('Users', schemaUsers)
//initSaveUsers()
//initSaveProducts()

const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.use('/order', function (req, res, next) {
  validateUser(req, res, next)
}, function (req, res, next) {
  //console.log('Request Type:', req.method)
  next()
})


app.get('/', (req, res) => {
  showProducts(res);
})

app.get('/user/:id', (req, res) => {
  let id = req.params.id;
  showUser(id, res);
})

app.post('/order', (req, res) => {
  return userOrder(req, res);
})


app.get('/api/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})
app.get('/contact', (req, res) => res.send('Contact us!'))
app.get('/*', (req, res) => res.send('Other pages'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function showUser(id, res) {
  return res.render("userForm", {id: id});
}

function validateUser(req, res, next) {
  let email = req.body.email
  let password = req.body.password

  Users.findOne({"email": email, "password": password}, function (err, user) {
    if (err || !user) {
      return res.sendStatus(403);
    }
    return next()
  })
}

function userOrder(req, res) {
  let id = req.body.id

  return orderProductById(id, res)
}

function orderProductById(id, res) {
  Products.findByIdAndUpdate(id, {
    $inc: {"orders_counter": 1}
  }, function (err, product) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.send(`${product.name} ordered`)
    //return res.json({response: {message: product.name}})
  })
}


function getAllProducts(callback) {
  Products.find(function (err, list) {
    if (err) {
      return callback(error)
    }
    return callback(null, list)
  })
}

function showProducts(res) {
  getAllProducts((err, products) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500)
    }
    return res.render("index", {products: products});
  });

}

function initSaveProducts() {
  let p = new Products;
  p.name = "Pillars of the earth - Ken Follett"
  p.description = ""
  p.USD_price = 2
  p.EUR_price = 1.75
  p.file_link = "https://kalmtec.com/A02"
  p.creation_date = "2020-01-02"
  p.orders_counter = 1
  p.save();
}

function initSaveUsers() {
  let p = new Users;
  p.email = "keith.vernon@batiactugroupe.com"
  p.password = "kv"
  p.save();
}