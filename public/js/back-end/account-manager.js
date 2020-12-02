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

/*---------------------------------------
  Database               
-----------------------------------------*/

// Adding a new user account to database during registration
async function addUser(type, firstName, lastName, username, email, password, confirmPassword) {
    await openDatabase();
    console.log("Registration: {" + type + " " + firstName + " " + lastName + " "+ username + " "+ email + " "+ password + " " + confirmPassword + "}");
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
async function addUserAddress(id, address, city, state, country, zip, password) {
    await openDatabase();
    const userPassword = await db.get("SELECT password FROM Users WHERE user_id=?", id);
    const passwordMatches = await bcrypt.compare(password, userPassword.password);
    if (address && city && state && country && zip && password) {
        if (passwordMatches) {
            await db.run("INSERT INTO UserDetails(user_id, address, city, state, country, zip) VALUES (?,?,?,?,?,?)",
                    id, address, city, state, country, zip);
            console.log("Registration: {" + address + " " + city + " " + state + " "+ country + " "+ zip + "}");
        } else {
            return "The password you inputted is incorrect."
        }
    } else {
        return "Please answer all the fields.";
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