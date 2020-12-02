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

 /* TODO -- A function to add a new product to the cart */
async function addProductToCart(name, type="", description="", cost=0) {
    await openDatabase();
    db.serialize(() => {
        let sql = "";
        stmt.run(sql, [], (err) => {
            if (err) throw err;
            console.log(name + " is added to the cart.");
        });
      });
    
}

 /* A function to update a product in the cart */
 async function updateProductInCart(id, newQuantity) {
    await openDatabase();
    db.serialize(() => {
        let sql = "UPDATE OrderDetails SET Quantity=? WHERE product_id=?";
        stmt.run(sql, [newQuantity, id], (err) => {
            if (err) throw err;
            console.log(name + "'s quantity is updated in the cart.");
        });
      });
    
}

 /* A function to delete a product from the cart */
 async function deleteProductFromCart(id) {
    await openDatabase();
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