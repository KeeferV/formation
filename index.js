let os = require('os')
var fs = require('fs')

fs.readFile(`${__dirname}/products.json`, (err, data) => {
  if (err) {
    throw err;
  }
  try {
    var books = JSON.parse(data);
  } catch (err) {
    throw err;
  }
  getAllProducts(books);
  //for (i in books) {
    //console.log(books[i].name);
  //}

})


function getAllProducts(books) {
  books.forEach(book => {
    console.log(`${book.id}/${book.name}/${book.EUR_price}/${book.orders_counter}`);
  })
  //for (i in books) {
  //  console.log(`${books[i].id}/${books[i].name}/${books[i].EUR_price}/${books[i].orders_counter}`);
  //}
}