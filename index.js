let os = require('os')
var fs = require('fs')
var readline = require('readline');
var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

console.log("Enter ID");

rl.on('line', function (line) {
  let bits = line.split("i want product ");
  if (bits[1]) {
    let id = bits[1];
    orderProductById(id);
  } else {
    process.exit();
  }
})


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
      if (book.id === id) {
        book.orders_counter++;
        data = JSON.stringify(books)
        fs.writeFile(`${__dirname}/products.json`, data, "UTF8", (err, data) => {
          if (err) {
            throw err;
          }
          console.log(`Command terminée. Voici votre fichier:${book.file_link}`)
          process.exit();
        });
        //break;
      }
    })
  })
}
