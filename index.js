//var x = "Hello ! I am node.js";
//console.log(x)
//process.stdout.write("'comme ici");
//stdin

let os = require('os')
var fs = require('fs')

/*
 var readline = require('readline');
 var rl = readline.createInterface({input: process.stdin, output: process.stdout, terminal: false});

console.log(__dirname, __filename);

console.log(os.uptime());
console.log(process.platform);

rl.on('line', function (line) {
  console.log(line);
})

let files = fs.readdirSync(`${__dirname}/files/`);

files.forEach((file) => {
  //console.log(file);
  //const content = fs.readFileSync(`${__dirname}/files/${file}`, 'UTF8')
  //console.log(content);
  fs.readFile(`${__dirname}/files/${file}`, 'UTF8', (err, file) => {
    console.log(err, file);
  })

})
*/

//fs.readFile(`${__dirname}/products.json`, 'UTF8', (err, file) => {
fs.readFile(`${__dirname}/products.json`, (err, data) => {
  if (err) {
    throw err;
  }
  let books = JSON.parse(data);
  for (i in books) {
    console.log(books[i].name);
  }

})
