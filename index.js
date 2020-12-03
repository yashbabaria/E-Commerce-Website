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
var order = require('./public/js/back-end/order-manager.js');
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

app.get('/store', async (req, res) => {
    renderStore(req, res);
});

app.get('/contact', (req, res) => {
    res.render("contact", checkStatus(req));
});

app.get('/cart', async (req, res) => {
    const orderDetails = await order.cart(req.user.user_id);
    const subTotal = await order.current(req.user.user_id);
    const miscTotal = subTotal.total * 0.1;
    const totalFee = subTotal.total + miscTotal;
    if (req.user) {
        res.render('cart', { status: "Hi " + req.user.username, user: req.user.username, 
            orders: orderDetails, info: subTotal, miscFee: miscTotal, total: totalFee });
    } else {
        res.render('login');
    }
});

app.get('/register', (req, res) => {
    res.render("register", { layout: "form" });
});

app.get('/login', async (req,res) => {
    if (req.user) {
        redirectToAccount(req, res);
    } else {
        res.render("login", { layout: "form" });
    }
});

app.get('/signout', async (req, res) => {
    res.clearCookie('authToken');
    return res.redirect('/');
});

app.get('/add-product', async (req, res) => {
    res.render("add-product", { layout: "form", operation: "ADD", operationPath:"/add-product" });
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
            let user = await account.login(req.body.username, req.body.password);
            const token = await auth.create(user);
            res.cookie('authToken', token);
            res.redirect("/");
        } else {
            res.render('register', { error: errorMessage, layout: "form" });
        }
    } catch (err) {
        return res.render('register', { error: err, layout: "form" });
    }
});

app.post('/add-address', async (req,res) => {
    try {
        let errorMessage = await account.addAddress(req.user.user_id, req.body.address, req.body.city,
            req.body.state, req.body.country, req.body.zip, req.body.password);
        if (!errorMessage) {
            redirectToAccount(req, res);
        } else {
            redirectToAccount(req, res, errorMessage);
        }
    } catch (err) {
        return res.render('errorPage', { error: "in add-address" });
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

// Add Product
app.post('/add-product', async (req,res) => {
    try {
        let errorMessage = await storage.add(req.body.name, req.user.user_id, req.body.type,
            req.body.description, req.body.cost, req.body.image);
        if (!errorMessage) {
            redirectToAccount(req, res);
        } else {
            res.render('add-product', { error: errorMessage, layout: "form" });
        }
    } catch (err) {
        return res.render('errorPage', { error: "in add-product" });
    }
});

// Delete Product
app.post('/delete-product', async (req,res) => {
    try {
        await storage.delete(req.body.id);
        console.log("Deleted: " + req.body.id);
        redirectToAccount(req, res);
    } catch (err) {
        return res.render('errorPage', { error: "in delete-product" });
    }
});

//Add product to cart
app.post('/add-to-cart', async (req,res) => {
    try {
        if (req.user) {
            await order.add(req.user.user_id, req.body.id);
            const subTotal = await order.current(req.user.user_id);
            const miscTotal = subTotal.total * 0.1;
            const totalFee = subTotal.total + miscTotal;
            const orderDetails = await order.cart(req.user.user_id);
            res.render('cart', { status: "Hi " + req.user.username, user: req.user.username, 
                orders: orderDetails, info: subTotal, miscFee: miscTotal, total: totalFee });
        } else {
            res.render('login');
        }
    } catch (err) {
        return res.render('errorPage', { error: "in delete-product" });
    }
});

// Delete items from cart
app.post('/delete-from-cart', async (req,res) => {
    try {
        await order.delete(req.user.user_id, req.body.id);
        const orderDetails = await order.cart(req.user.user_id);
        const subTotal = await order.current(req.user.user_id);
        const miscTotal = subTotal.total * 0.1;
        const totalFee = subTotal.total + miscTotal;
        res.render('cart', { status: "Hi " + req.user.username, user: req.user.username, 
            orders: orderDetails, info: subTotal, miscFee: miscTotal, total: totalFee });
    } catch (err) {
        return res.render('errorPage', { error: "in delete-product" });
    }
});

app.post('/store-word', async (req, res) => {
    renderStore(req, res, "AND Products.name LIKE ?", [req.body.search]);
});

app.post('/store-type', async (req, res) => {
    if (req.body.typeSearch != "All") {
        renderStore(req, res, "AND Products.type=?", [req.body.typeSearch]);
    } else {
        renderStore(req, res);
    }
});

//Checkout Order
app.post('/checkout', async (req,res) => {
    try {
        res.redirect('/');
    } catch (err) {
        return res.render('errorPage', { error: "in checkout order" });
    }
});


/*-----------------------------------------------------------------------------------
    ERROR HANDLERS & SETUP
-------------------------------------------------------------------------------------*/

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

 /* A function to look for the account status when there is no other parameter*/
 function checkStatus(req, addition=null) {
    if (req.user) {
        return { status: "Hi " + req.user.username, user: req.user.username, addition };
    } else {
        return { status: "Sign In", user: null, addition };
    }
 }

/* A function to redirect users to their account page */
async function redirectToAccount(req, res, errorMessage=null) {
    var db = await dbPromise;
    const userDetails = await db.get('SELECT * FROM UserDetails WHERE user_id=?;', [req.user.user_id]);
    if (req.user.account_type == "seller") {
        const products = await storage.load("AND Products.seller_id=?", [req.user.user_id]);
        res.render("seller-account", { status: "Hi " + req.user.username, user: req.user, details: userDetails, 
            products, error: errorMessage });
    } else if (req.user.account_type == "buyer") {
        const orderList = await db.get('SELECT * FROM Orders WHERE user_id=?;', [req.user.user_id]);
        if (orderList) {
            console.log(userDetails);
            const details = await db.get('SELECT * FROM OrderDetails WHERE user_id=?;', [orders.order_id]);
            res.render("buyer-account", { status: "Hi " + req.user.username, user: req.user, error: errorMessage, 
                details: userDetails, orders: orderList, orderDetails: details });
        } else {
            res.render("buyer-account", { status: "Hi " + req.user.username, user: req.user, error: errorMessage,
                details: userDetails });
        }
    }
}

/* A function to render store front based on filters */
async function renderStore(req, res, constraint=null, param=null) {
    const products = await storage.load(constraint, param);
    if (req.user) {
        res.render('store', { status: "Hi " + req.user.username, user: req.user.username, products });
    } else {
        res.render('store', { status: "Sign In", user: null, products });
    }
}

// For testing
// async function test() {
//     var db = await dbPromise;
//     //db.run('INSERT INTO Users VALUES ("2","Test","Test","Test","test@gmail.com","$2b$10$.1pGb3wIB9BbBLACYAOVL.SaSfvSjHkm3HNNj.v3DNpdZzew1hOOa","seller");');
//     //db.run('DELETE FROM OrderDetails;');
// }
// test();