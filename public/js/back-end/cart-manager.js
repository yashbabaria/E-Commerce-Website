/*
 * Code for adding, updating, and deleting products from the cart and order database.
 */

const dbPromise = require('../../../index');

 /* A function to open database */
 async function openDatabase() {
    try { 
        db = await dbPromise.dbPromise; 
        console.log("Connected to cart database");
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
    
}

 /* A function to update a product in the cart */
 function updateProductInCart(id, newQuantity) {
    openDatabase();
    db.serialize(() => {
        let sql = "UPDATE OrderDetails SET Quantity=? WHERE product_id=?";
        stmt.run(sql, [newQuantity, id], (err) => {
            if (err) throw err;
            console.log(name + "'s quantity is updated in the cart.");
        });
      });
    
}

 /* A function to delete a product from the cart */
 function deleteProductFromCart(id) {
    openDatabase();
    db.serialize(() => {
        let sql = "DELETE FROM OrderDetails WHERE product_id=?";
        db.run(sql, [id], (err) => {
            if (err) throw err;
            console.log(name + " is deleted.");
        });
      });
    
}

/* TODO -- Process order */

/* TODO -- Cancel order */