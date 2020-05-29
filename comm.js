const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {

  socket.emit('welcome', {message: 'hello world'})

  socket.on('clientresponse', function (data) {
    console.log(data);
  });

  socket.on('message', function (data) {
    console.log(data);
    socket.emit('message', {message: 'received ' + data.data})
  });

});

server.listen(3000);

const path = require('path')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//app.use(express.static("public"))


app.get('/', (req, res) => {
  res.render("comm")
})
