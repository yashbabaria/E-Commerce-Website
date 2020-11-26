const express = require('express');
const exphbs = require('express-handlebars');
const cookie = require('cookie-parser');

const app = express();
app.engine("handlebars", exphbs({defaultLayout: 'main'}));
app.set("view engine", "handlebars");

global.fetch = require('node-fetch');

var storage = require('./public/js/back-end/product-manager.js');
var account = require('./public/js/back-end/account-manager.js');

const port = 4200;

app.use(cookie());
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const is_logged_in = false;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {

});

app.get('/login', async (req,res) => {
 
});

app.get('/product-api', async (req, res) => {
    var products = await storage.load(req.body.category);
    res.json(products);
});

//Sign Up
app.post('/register', async (req,res) => {
    await account.addUser(req.body.username, req.body.dob, req.body.email, req.body.pass);
    res.redirect("/");
})

//Sign In
app.post('/login', async (req,res) => {
    let error = await account.login(req.body.username, req.body.password);
    if (error) {
        //TODO Crete a popup message
    } else {
        res.redirect("/");
    }
});

//Check Out
app.post('/checkout', async (req,res) => {
    await account.addAddress(req.body.username, req.body.address, req.body.city,
        req.body.state, req.body.country, req.body.postalCode, req.body.pass);
    res.redirect("/");
})

// Add Products
app.post("/product-api", async (req, res) => {
    const product = req.body;
    res.json({
        name: product.name,
        type: product.type,
        description: product.desc,
        cost: product.cost
    });
    await storage.addToStore(product.name, product.type, product.desc, product.cost);
    res.redirect("/");
});

// 404 error handler
app.use((req, res, next) => {
    next({
        status: 404,
        message: `${req.path} not found`
    });
});
  
// Errors handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.render('errorPage', {error: err.message || err});
});

// Localhost setting
app.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
});