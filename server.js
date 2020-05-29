var fs = require('fs')
var path = require('path')
var mongoose = require('mongoose')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

var products = require('./models/products.js');
//var passportLocalMongoose = require('passport-local-mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/database', {
  "useNewUrlParser": true,
  "useFindAndModify": false,
  "useUnifiedTopology": true
})
mongoose
    .connection
    .on('connected', function () {
      console.log('Mongoose default connection open to db')
    });
mongoose
    .connection
    .on('error', function (err) {
      console.log(`Mongoose default connection error:${err}`)
    })

var schemaProducts = new mongoose.Schema({
  "name": "String",
  "description": "String",
  "USD_price": "Decimal128",
  "EUR_price": "Decimal128",
  "file_link": "String",
  "creation_date": "Date",
  "orders_counter": "Number"
});
var schemaUsers = new mongoose.Schema({
  "email": "String",
  "password": "String"
});
var schemaOrders = new mongoose.Schema({
  "product": "String",
  "user": "String",
  "price": "Decimal128"
});
var Products = mongoose.model('Products', schemaProducts)
var Users = mongoose.model('Users', schemaUsers)
var Orders = mongoose.model('Orders', schemaOrders)
//initSaveUsers()
//initSaveProducts()


const express = require('express')
const app = express()
const port = 3000

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'Insert randomized text here',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  Users.findById(id, function (err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy(
    {usernameField: "email"},
    function (email, password, done) {
      Users.findOne({
        email: email
      }, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false);
        }

        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
));

function checkConnected(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.redirect('/login');
}


app.use('/', function (req, res, next) {
  //console.log(`User :  ${req.user}`)
  next();
});


app.get('/login', (req, res) => {
  let id = "";
  return res.render("userForm", {id: id});
})

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
      res.redirect('/' + req.body.email);
    }
);

app.get('/order/:id',
    checkConnected,
    (req, res) => {
  //rs.send("ok");
  let id = req.params.id;
  orderProduct(id, req, res)
})

app.get('/', (req, res) => {
  showProducts(req, res);
})

app.get('/success', (req, res) => {
  return res.render("show");
})

app.get('/allusers', (req, res) => {
  showUsers(res);
})

app.get('/allorders', (req, res) => {
  showOrders(res);
})

app.get('/getUserProducts', checkConnected, (req, res) => {
  getUserProducts(req, res);
})

app.get('/api/order/:id', (req, res) => {
  let id = req.params.id;
  orderProductById(id, res)
})

app.get('/contact', (req, res) => res.send('Contact us!'))
app.get('/*', (req, res) => res.send('Other pages'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function showUser(id, res) {
  return res.render("userForm", {id: id});
}

function validateUser(req, res, next) {
  let email = req.body.email
  let password = req.body.password

  Users.findOne({"email": email, "password": password}, function (err, user) {
    if (err || !user) {
      return res.sendStatus(403);
    }
    return next()
  })
}

function getUserOrders(idUser) {
  return new Promise((resolve, reject) => {
    Orders.find({"user": idUser}, function (err, list) {
      if (err) {
        reject(err)
      }
      resolve(list)
    })
  });
}

async function getUserProducts(req, res) {
  var idUser = req.user._id;

  try {
    const orders = await getUserOrders(idUser);
    var list = []
    for (i in orders) {
      let order = orders[i]
      let product = await getProduct(order.product)
      list.push({"product": product, "order": order})
    }
    console.log(req.user)
    return res.render("userproducts", {"list": list, "user": req.user})
  } catch (e) {
    return res.send("ERROR")
  }

}


async function orderProduct(id, req, res) {
  try {
    const product = await getProduct(id)
    const orderMessage = await addOrder(req.user, product)
    return res.send(orderMessage)
  } catch (e) {
    console.log(e);
    res.send("ORDER failed")
  }

}

function getProduct(id) {
  return new Promise((resolve, reject) => {
    Products.findByIdAndUpdate(id, {
      $inc: {"orders_counter": 1}
    }, function (err, product) {
      if (err) {
        reject(err)
      } else {
        resolve(product)
      }
    })


  });
}

async function addOrder(user, product) {
  console.log(user);
  return new Promise((resolve, reject) => {
    try {
      let o = new Orders;
      o.product = product._id
      o.user = user._id
      o.price = product.EUR_price
      o.save();
      resolve("ok");
    } catch (e) {
      reject(e)
    }
  });
}


function orderProductById(id, res) {
  Products.findByIdAndUpdate(id, {
    $inc: {"orders_counter": 1}
  }, function (err, product) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    return res.send(`${product.name} ordered`)
    //return res.json({response: {message: product.name}})
  })
}


function getAllProducts(callback) {
  Products.find(function (err, list) {
    if (err) {
      return callback(error)
    }
    return callback(null, list)
  })
}

function showProducts(req, res) {
  getAllProducts((err, products) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500)
    }
    let user = (req.user) ? req.user : null
    return res.render("index", {products: products, "user": user});
  });

}

function getAllUsers(callback) {
  Users.find(function (err, list) {
    if (err) {
      return callback(error)
    }
    return callback(null, list)
  })
}
function showUsers(res) {
  getAllUsers((err, users) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500)
    }
    return res.render("showallusers", {users: users});
  });

}

function getAllOrders(callback) {
  Orders.find(function (err, list) {
    if (err) {
      return callback(error)
    }
    return callback(null, list)
  })
}
function showOrders(res) {
  getAllOrders((err, orders) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500)
    }
    return res.render("showallorders", {orders: orders});
  });

}


function initSaveProducts() {
  let p = new Products;
  p.name = "Pillars of the earth - Ken Follett"
  p.description = ""
  p.USD_price = 2
  p.EUR_price = 1.75
  p.file_link = "https://kalmtec.com/A02"
  p.creation_date = "2020-01-02"
  p.orders_counter = 1
  p.save();
}

function initSaveUsers() {
  let p = new Users;
  p.email = "keith.vernon@batiactugroupe.com"
  p.password = "kv"
  p.save();
}