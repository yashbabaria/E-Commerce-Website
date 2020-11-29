const express = require('express');
const exphbs = require('express-handlebars');
const cookies = require('cookie-parser');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

global.fetch = require('node-fetch');

var storage = require('./public/js/back-end/product-manager.js');
var account = require('./public/js/back-end/account-manager.js');
var auth = require('./public/js/back-end/auth.js');

// Function for opening database
const dbPromise = sqlite.open({ filename: "data.db", driver: sqlite3.Database });
exports.dbPromise = dbPromise;

const port = 4200;

app.use(cookies());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
    const { authToken } = req.cookies; 
    if (!authToken) {
      return next();
    }
  
    try {
        const user = await auth.find(authToken);
        req.user = user;
    } catch (err) {
        return next({ message: err, status: 500 });
    }
    next();
});

/*-----------------------------------------------------------------------------------------------
        GET - COMMUNICATE WITH CLIENT
------------------------------------------------------------------------------------------------*/

app.get('/', (req, res) => {
    res.render("home", checkStatus(req));
});

app.get('/about', (req, res) => {
    res.render("about", checkStatus(req));
});

app.get('/store', (req, res) => {
    var products = storage.load();
    res.render("store", checkStatus(req, products));
});

app.get('/contact', (req, res) => {
    res.render("contact", checkStatus(req));
});

app.get('/cart', (req, res) => {
    res.render("cart", checkStatus(req));
});

app.get('/register', (req, res) => {
    res.render("register", { layout: "form" });
});

app.get('/login', async (req,res) => {
    if (!req.user) {
        res.render("login", { layout: "form" });
    } else {
        res.render("account", checkStatus(req));
    }
});

app.get('/product-api', async (req, res) => {
    var products = await storage.load(req.body.category);
    res.json(products);
});

/*-----------------------------------------------------------------------------------------------
        POST - PROCESS THINGS IN SERVER
------------------------------------------------------------------------------------------------*/
//Sign Up
app.post('/register', async (req,res) => {
    try {
        let errorMessage = await account.addUser(req.body.type, req.body.firstName, req.body.lastName, 
            req.body.username, req.body.email, req.body.password, req.body.confirmPassword);
        if (!errorMessage) {
            res.redirect("/");
        } else {
            res.render('register', { error: errorMessage, layout: "form" });
        }
    } catch (err) {
        return res.render('register', { error: err, layout: "form" });
    }
});

//Sign In
app.post('/login', async (req,res) => {
    try {
        let user = await account.login(req.body.username, req.body.password);
        if (user) {   
            const token = await auth.create(user);
            res.cookie('authToken', token);
            res.redirect("/");
        } else {
            res.render('login', { error: "Username or password is invalid", layout: "form" });
        }
    } catch (err) {
        return res.render('login', { error: err, layout: "form" });
    }
});

//Check Out
app.post('/checkout', async (req,res) => {
    await account.addAddress(req.body.username, req.body.address, req.body.city,
        req.body.state, req.body.country, req.body.postalCode, req.body.pass);
    res.redirect("/");
});

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

const setup = async() => {
    const db = await dbPromise;
    await db.migrate();

    // Localhost setting
    app.listen(port, (error) => {
        if (error)
        {
            return console.log("Something went wrong!", error);
        }
        console.log("Server is listening on ", port);
    });
}

setup();

/*--------------------------------------------------------------------
    HELPER FUNCTIONS
---------------------------------------------------------------------*/
 /* A function to close database */
 function closeDatabase() {
    db.close((err) => {
        if (err) throw err;
        console.log('Database connection closed');
    });
 }

 /* A function to look for the account status */
 function checkStatus(req, addition=null) {
    if (req.user) {
        return { status: "Hi " + req.user.username, user: req.user.username, addition };
    } else {
        return { status: "Sign In", user: null, addition };
    }

 }