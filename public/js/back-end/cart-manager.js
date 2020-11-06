/*
 * Code for adding, updating, and deleting products from the cart and order database.
 */

const sqlite3 = require('sqlite3').verbose();

 /* A function to open database */
 function openDatabase() {
    const db = new sqlite3.Database('Primary.db', sqlite3.OPEN_READWRITE, (err) => {
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

 /* TODO -- A function to add a new product to the cart */
function addProductToCart(name, type="", description="", cost=0) {
    openDatabase();
    db.serialize(() => {
        let sql = "";
        stmt.run(sql, [], (err) => {
            if (err) throw err;
            console.log(name + " is added to the cart.");
        });
      });
    closeDatabase();
}

 /* A function to update a product in the cart */
 function updateProductInCart(id, name, newQuantity) {
    openDatabase();
    db.serialize(() => {
        let sql = "UPDATE OrderDetails SET Quantity=? WHERE Product_Id=?";
        stmt.run(sql, [newQuantity, id], (err) => {
            if (err) throw err;
            console.log(name + "'s quantity is updated in the cart.");
        });
      });
    closeDatabase();
}

 /* A function to delete a product from the cart */
 function deleteProductFromCart(id, name) {
    openDatabase();
    db.serialize(() => {
        let sql = "DELETE FROM OrderDetails WHERE Product_Id=?";
        db.run(sql, [id], (err) => {
            if (err) throw err;
            console.log(name + " is deleted.");
        });
      });
    closeDatabase();
}

/* TODO -- Process order */

/* TODO -- Cancel order */