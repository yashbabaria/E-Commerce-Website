const express = require('express');
const app = express();
const port = 8080;

// importing sqlite
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

// opening sqlite db
const dbPromise = open({
  filename: "./Primary.sqlite",
  driver: sqlite3.Database,
})

// import bcrypt to hash the users password
const bcrypt = require('bcrypt')
const saltRounds = 10

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(__dirname + '/index.html');
});

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
//Sign Up
app.post('/register', async (req,res) => {
  const db = await dbPromise;

  // const country = req.body.country


  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const username = req.body.username
  const password = req.body.pass

  //hashing the password
  const hashPassword = await bcrypt.hash(password, saltRounds)
  const userTaken = await db.run("SELECT Username FROM customers WHERE Username=?", username)
  if(userTaken){
    console.log("Username taken");
  }else if(email && username && password){
    await db.run("INSERT INTO customers(firstname,lastname,Email,Username,Password) VALUES (?,?,?,?,?)",
            firstname,lastname,email, username, hashPassword)
              res.redirect("/")
    //res.send(`Hello ${username}, With Password ${password}`)
  }else {
    console.log("ERROR");
  }

})
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/public/User\ SignUp/index.html')
})

//Sign In Works
app.post('/login', async (req,res) => {
  const db = await dbPromise
  const username = req.body.username
  const password = req.body.pass
  const user = await db.get("SELECT * FROM customers WHERE username=?", username)
  if(!user){
     // error username not found in database
     alert("Username not Found")
  }else{
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if(!passwordsMatch){
      // error password not found in database
      alert("The password is incorrect")
    }else{
      res.redirect("/")
    }

  }
  //console.log(user.Password);

})

app.get('/login', async (req,res) => {
    res.sendFile(__dirname + '/public/User\ Login/index.html')
})

app.get('/payment', async (req,res) => {
    // Payment page.
})

app.post('/payment', async (req,res) => {
  // Get the cart, add the prices, when the user clicks on the pay send to summary screen then go back home.

})

app.post('/address', async (req,res) =>{
  //not working yet
  const home_address = req.body.home_address
  const billing_address = req.body.billing_address
  const apart_address = req.body.apart_address

  const city = req.body.city
  const state = req.body.state
  const postalCode = req.body.postalCode
  const user = await db.run("SELECT * FROM customers WHERE Username=? AND Password=?", username, password)
  if(city & state & postalCode){
    if(home_address){
      await db.run("INSERT INTO customer_private(customer_id,Home_Address,City,State,Postal_Code) VALUES (?,?,?,?,?)",
                  user.customer_id, city, state, postalCode)
      console.log("Location inputed");
    }else if(billing_address){
      await db.run("INSERT INTO customer_private(customer_id,Billing_Address, City,State,Postal_Code) VALUES (?,?,?,?,?)",
                  user.customer_id, city, state, postalCode)
      console.log("Location inputed");
    }else if(apart_address){
      await db.run("INSERT INTO customer_private(customer_id,Apartment_Address,City,State,Postal_Code) VALUES (?,?,?,?,?)",
                  user.customer_id, city, state, postalCode)
      console.log("Location inputed");
    }else{
      console.log("Location is not inputed");
    }

  }
})
app.get('/address', (req,res) => {
  // account address input page.
})
app.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
});
