const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
var storage = require('./public/js/back-end/product-manager.js');
var account = require('./public/js/back-end/account-manager.js');

const port = 4200;

app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/User\ SignUp/index.html')
});

app.get('/login', async (req,res) => {
    res.sendFile(__dirname + '/User\ Login/index.html')
});

app.get('/product-api', (req, res) => {
    var products = storage.load(req.body.category);
    res.json(products);
});

//Sign Up
app.post('/register', async (req,res) => {
    account.addUser(req.body.username, req.body.dob, req.body.email, req.body.pass);
    res.redirect("/");
})

//Sign In
app.post('/login', async (req,res) => {
    account.login(req.body.username, req.body.pass);
    res.redirect("/");
});

//Check Out
app.post('/checkout', async (req,res) => {
    account.addAddress(req.body.username, req.body.address, req.body.city,
        req.body.state, req.body.country, req.body.postalCode, req.body.pass);
    res.redirect("/");
})

// Add Products
app.post("/product-api", (req, res) => {
    const product = req.body;
    res.json({
        name: product.name,
        type: product.type,
        description: product.desc,
        cost: product.cost
    });
    storage.addToStore(product.name, product.type, product.desc, product.cost);
    res.redirect("/");
});

// Localhost setting
app.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
});
