/*
 * Code for adding, updating, and deleting products from the store and product database.
 */

var products = [];

/* A function to open database */
async function openDatabase() {
   db = await new sqlite.Database('Primary.sqlite', sqlite3.OPEN_READWRITE, (err) => {
       if (err) 
       {
           console.log(err.message);
       }
       console.log('Connected to database');
   });
}

/* A function to close database */
async function closeDatabase() {
   db.close((err) => {
       if (err) throw err;
       console.log('Database connection closed');
   });
}

/*---------------------------------------
  Database               
-----------------------------------------*/

async function addUser(name, dob, email, password) {
    openDatabase();
    if(name & dob & email){
        await db.run("INSERT INTO customers(name, Date_of_Birth, Email) VALUES (?,?,?)",
                    name, dob, email);
    }
    hashPswd(name, password);
    closeDatabase();
}

async function addUserAddress(name, address, city, state, country, postalCode, password) {
    openDatabase();
    if(address & city & state & country & postalCode){
        await db.run("INSERT INTO customer_private(Home Address, City, State, Country, Postal Code)",
                address, city, state, country, postalCode);
    }
    //checkPswd(name, password);
    closeDatabase();
}

async function hashPswd(username, password) {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    if(username && password){
        await db.run("INSERT INTO customers(username,password) VALUES (?,?)", username, hashPassword);
    }
}

async function loginUser(username, password) {
    const user = await db.get("SELECT * FROM customers WHERE username=?", username);
    if(!user){
       // error username not found in database
       res.send("Username not Found");
    }
    const userPassword = await db.get("SELECT password FROM customers WHERE username=?", username);
    const passwordMatches = await bcrypt.compare(password, userPassword);
    console.log(user.password);
    if(!passwordMatches){
      // error password not found in database
      res.send("The password is incorrect");
    }
    res.redirect("/");
}

module.exports = {
    addUser: addUser,
    login: loginUser,
    addAddress: addUserAddress
};