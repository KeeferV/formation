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
app.get('/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})
app.get('/api/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})
app.get('/contact', (req, res) => res.send('Contact us!'))
app.get('/*', (req, res) => res.send('Other pages'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


function orderProductById(id, res) {
  getAllProducts((err, products) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    var link;
    products.forEach(product => {
      if (product.id == id) {
        product.orders_counter++;
        link = product.file_link;
      }
    });
    let new_products = {"products": products}
    fs.writeFile(path.join(__dirname, "products.json"), JSON.stringify(new_products, null, 4), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.json({response: {message: `Commande terminée! Voici votre fichier ${link}`}})
      //return res.send()
    });
  })
}


function getAllProducts(callback) {
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
