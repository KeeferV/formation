let os = require('os')
var fs = require('fs')

fs.readFile(`${__dirname}/products.json`, (err, data) => {
  if (err) {
    throw err;
  }
  let books = JSON.parse(data);
  for (i in books) {
    console.log(books[i].name);
  }

})
