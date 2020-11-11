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

app.use(express.urlencoded());
//Sign Up
app.post('/register', async (req,res) => {
  /*
  Insert to customers Table:
      const name = req.body.name
      const dob = req.body.dob
      const email = req.body.email
  Insert to customer_private Table:
      const address = req.body.address
      const city = req.body.city
      const state = req.body.state
      const country = req.body.country
      const postalCode = req.body.postalCode
  */
  const username = req.body.username
  const password = req.body.pass
  //hashing the password
  const hashPassword = await bcrypt.hash(password, saltRounds)
  if(username && password){
    const db = await dbPromise;
    await db.run("INSERT INTO customers(username,password) VALUES (?,?)", username, hashPassword)
    res.redirect("/")
    //res.send(`Hello ${username}, With Password ${password}`)
  }else{
    res.sendFile('/User\ SignUp/index.html')
  }
})
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/User\ SignUp/index.html')
})

//Sign In
app.post('/login', async (req,res) => {
  const db = await dbPromise
  const username = req.body.username
  const password = req.body.pass
  const user = await db.get("SELECT * FROM customers WHERE username=?", username)
  if(!user){
     // error username not found in database
  }
  const passwordMatches = await bcrypt.compare(password, user.password)
  console.log(user.password);
  if(!passwordMatches){
    // error password not found in database
  }
  res.redirect("/")


})
app.get('/login', async (req,res) => {
    res.sendFile(__dirname + '/User\ Login/index.html')
})

app.listen(port, (error) => {
    if (error)
    {
        return console.log("Something went wrong!", error);
    }
    console.log("Server is listening on ", port);
});
