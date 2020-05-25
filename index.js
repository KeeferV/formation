let os = require('os')
var fs = require('fs')

fs.readFile(`${__dirname}/products.json`, (err, data) => {
  if (err) {
    throw err;
  }
  try {
    let books = JSON.parse(data);
  } catch (err) {
    throw err;
  }
  for (i in books) {
    console.log(books[i].name);
  }

})
