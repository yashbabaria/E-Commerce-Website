/*
 * Code for adding, updating, and deleting products from the store and product database.
 */

/* A function to open database */

const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
let db;

 /* A function to open database */
async function openDatabase() {
    const dbPromise = sqlite.open({
        filename: "Primary.sqlite",
        driver: sqlite3.Database,
      });
    try { 
        db = await dbPromise; 
    } catch { 
        console.log("Database error");
    }
}

/* A function to close database */
function closeDatabase() {
   db.close((err) => {
       if (err) throw err;
       console.log('Database connection closed');
   });
}

/*---------------------------------------
  Database               
-----------------------------------------*/

async function addUser(firstName, lastName, username, email, password, confirmPassword) {
    await openDatabase();
    if (firstName, lastName, username, password, confirmPassword, email) {
        await db.run("INSERT INTO customers(name, Date_of_Birth, Email) VALUES (?,?,?)",
                    name, dob, email);
    } else {
        // TODO
    }
    hashPswd(name, password);
    closeDatabase();
}

async function addUserAddress(name, address, city, state, country, postalCode, password) {
    await openDatabase();
    if(address & city & state & country & postalCode){
        await db.run("INSERT INTO customer_private(Home Address, City, State, Country, Postal Code)",
                address, city, state, country, postalCode);
    }
    closeDatabase();
}

async function hashPswd(username, password) {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    if (username && password) {
        await db.run("INSERT INTO customers(username,password) VALUES (?,?)", username, hashPassword);
    }
}

async function loginUser(username, password) {
    try {
        await openDatabase();
        const user = await db.get("SELECT * FROM customers WHERE username=?", username);
        if (!user) {
            // error username not found in database
            return false;
        }
        const userPassword = await db.get("SELECT password FROM customers WHERE username=?", username);
        const passwordMatches = await bcrypt.compare(password, userPassword);
        console.log(user.password);
        if(!passwordMatches){
            // error password not found in database            
            return false;
        }
        closeDatabase();
        return true;
    } catch {
        console.log("Error in user login");
    }
}

module.exports = {
    addUser: addUser,
    login: loginUser,
    addAddress: addUserAddress
};