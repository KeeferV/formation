/*
var http = require('http')

const server = http.createServer(function (req, res) {
  const url = req.url;
  if (url === '/about') {
    res.write('<h1>about us</h1>');
  } else if (url === "/contact") {
    res.write('<h1>Contact us</h1>');
  } else {
    res.write(req.method)
    res.write('Hello world');
  }
  res.end()
}).listen(8082);
*/
var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var products = require('./models/products.js');
mongoose.connect('mongodb://localhost:27017/database', {useNewUrlParser: true})
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
  "id": "String",
  "name": "String",
  "description": "String",
  "USD_price": "Decimal128",
  "EUR_price": "Decimal128",
  "file_link": "String",
  "creation_date": "Date",
  "orders_counter": "Number"
});
var Products = mongoose.model('Products', schemaProducts)
//initSaveProducts()

const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"))

//app.use

app.get('/', (req, res) => {
  showProducts(res);
})
/*
app.get('/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})
*/
app.get('/api/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})
app.get('/contact', (req, res) => res.send('Contact us!'))
app.get('/*', (req, res) => res.send('Other pages'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function orderProductById(id, res) {
  Products.findOneAndUpdate({"id": id}, {
    $inc: {"orders_counter": 1}
  }, function (err, product) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.json({response: {message: product.name}})
  })
  /*
  getAllProducts((err, products) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    var link;
    products.forEach(product => {
      if (product.id == id) {
        product.orders_counter++;
        link = product.name;
      }
    });
    let new_products = {"products": products}

    fs.writeFile(path.join(__dirname, "products.json"), JSON.stringify(new_products, null, 4), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.json({response: {message: `Commande terminée!\n"${link}"`}})
      //return res.send()
    });
  })
  */
}


function getAllProducts(callback) {
  Products.find(function (err, list) {
    if (err) {
      return callback(error)
    }
    return callback(null, list)
  })

  /*
  fs.readFile(path.join(__dirname, "products.json"), "utf8", (err, contents) => {
    if (err) {
      return callback(err)
    }
    try {
      var products = JSON.parse(contents).products;
      return callback(null, products)
    } catch (error) {
      return callback(error)
    }
  })
  */
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
  p.id = "A02"
  p.name = "Pillars of the earth - Ken Follett"
  p.description = ""
  p.USD_price = 2
  p.EUR_price = 1.75
  p.file_link = "https://kalmtec.com/A02"
  p.creation_date = "2020-01-02"
  p.orders_counter = 1
  p.save();
}