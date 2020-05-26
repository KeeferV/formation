let os = require('os')
var fs = require('fs')
var path = require('path')
var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

console.log("Enter ID");

rl.on('line', function (line) {
  let bits = line.split("i want product");
  if (bits[1]) {
    let id = bits[1].trim();
    orderProductById(id);
  } else {
    process.exit();
  }
})


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

function orderProductById(id) {
  getAllProducts((err, products) => {
    if (err) {
      throw err;
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
      if (err)
        throw err;
      console.log('Commande terminée! Voici votre fichier', link);
      process.exit();
    });
  })
}
