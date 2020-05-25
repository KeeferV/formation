let os = require('os')
var fs = require('fs')

getAllProducts();

function getAllProducts() {
  fs.readFile(`${__dirname}/products.json`, (err, data) => {
    if (err) {
      throw err;
    }
    try {
      var books = JSON.parse(data);
    } catch (err) {
      throw err;
    }
    books.forEach(book => {
      console.log(`${book.id} - ${book.name} / ${book.EUR_price} / ${book.orders_counter}`);
    })

  })

}
/*
function orderProductById(id) {
  fs.readFile(`${__dirname}/products.json`, (err, data) => {
    if (err) {
      throw err;
    }
    try {
      var books = JSON.parse(data);
    } catch (err) {
      throw err;
    }
    books.forEach(book => {
      if (book.id == id) {
        book.orders_counter++;
        data = JSON.toString(books)

      }
    })
  }
}
*/