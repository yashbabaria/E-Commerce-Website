/*
    Creation of the Back-End Sign In Mechinism
*/

const sqlite3 = require('sqlite3').verbose();

 /* A function to open database */
 function openDatabase() {
    const db = new sqlite3.Database('Primary.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err)
        {
            console.log(err.message);
        }
        console.log('Connected to database');
    });
 }

 /* A function to close database */
 function closeDatabase() {
    db.close((err) => {
        if (err) throw err;
        console.log('Database connection closed');
    });
 }

// Function to check if Username is in database
// Check if account is regular or employee
function checkUsername(username) {

}
// Function to check if Password is correct
function checkPassword(password) {

}
