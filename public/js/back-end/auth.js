const uuidv4 = require('uuid').v4; 
const dbPromise = require('../../../index'); 
var db;

 /* A function to open database */
 async function openDatabase() {
    try { 
        db = await dbPromise.dbPromise; 
        console.log("Connected to auth database");
    } catch { 
        console.log("Database error");
    }
}

// Adding authorization code to user's account
async function createAuthToken(userId) {
    await openDatabase();
    const tokenString = uuidv4(); // Creating unique code
    await db.run('INSERT INTO AuthTokens (token, user_id) VALUES (?, ?);',
        tokenString, userId);
    return tokenString;
};

// Finding a user account based on their auth token
async function findAccountFromAuth (authToken) {
    await openDatabase();
    const token = await db.get('SELECT user_id FROM AuthTokens WHERE token=?;', [authToken]); 
    if (!token) {
        return null;
    } else {
        const user = await db.get('SELECT * FROM Users WHERE user_id=?;', [token.user_id]);
        //const account = { id: user.user_id, email: user.email, username: user.username };
        return user;
    }
};

module.exports = {
    create: createAuthToken,
    find: findAccountFromAuth
};