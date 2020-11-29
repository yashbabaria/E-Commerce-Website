/*
 * Code for adding, updating, and deleting products from the store and product database.
 */

/* A function to open database */

const bcrypt = require('bcrypt');
const dbPromise = require('../../../index');

 /* A function to open database */
async function openDatabase() {
    try { 
        db = await dbPromise.dbPromise; 
        console.log("Connected to account database");
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

// Adding a new user account to database during registration
async function addUser(type, firstName, lastName, username, email, password, confirmPassword) {
    await openDatabase();
    console.log("{" + type + " " + firstName + " " + lastName + " "+ username + " "+ email + " "+ password + " " + confirmPassword + "}");
    if (type, firstName, lastName, username, email, password, confirmPassword) {
        if (password == confirmPassword) {
            let hashedPassword = await bcrypt.hash(password, 10);
            await db.run(`INSERT INTO Users(first_name, last_name, username, email, password, 
                account_type) VALUES (?,?,?,?,?,?)`,
                firstName, lastName, username, email, hashedPassword, type);
            
            return;
        } else {
            return "The passwords do not match";
        }
    } else {
        return "Please fill out all forms with valid inputs";
    }
}

// Adding user's address to the account per checkout preference
async function addUserAddress(id, address, city, state, country, zip) {
    await openDatabase();
    if(address & city & state & country & postalCode){
        await db.run("INSERT INTO UserDetails(user_id, address, city, state, country, zip) VALUES (?,?,?,?,?,?)",
                id, address, city, state, country, zip);
    }
    
}

// Processing user's login request
async function loginUser(username, password) {
    console.log("Login: {" + username + " " + password + "}");
    try {
        await openDatabase();
        const user = await db.get("SELECT * FROM Users WHERE username=?", username);
        if (!user) {
            // error username not found in database
            return;
        }
        const passwordMatches = await bcrypt.compare(password, user.password);
        if(!passwordMatches){
            // error password not found in database            
            return;
        }
        return user.user_id;
    } catch {
        console.log("Error in user login");
    }
}

module.exports = {
    addUser: addUser,
    login: loginUser,
    addAddress: addUserAddress
};