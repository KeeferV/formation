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
var path = require('path')

const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//app.use

app.get('/', (req, res) => {
  //var o = {a: "Hi"}
  res.render("homepage");
})
app.get('/about', (req, res) => res.send('About us'))
app.get('/contact', (req, res) => res.send('Contact us!'))
app.get('/*', (req, res) => res.send('Other pages'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
