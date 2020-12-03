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
async function addProductToCart(userId, productId) {
    await openDatabase();
    console.log("Add to cart: {" + productId + "}");
    try {
        var currentOrderId = await checkOrder(userId);
        await db.run(`INSERT INTO OrderDetails(order_id, product_id, quantity) VALUES (?,?,?)`,
            currentOrderId, productId, 1);
    } catch(err) {
       console.log("Error in adding to cart: " + err);
    }
}

 /* A function to update a product in the cart */
 async function checkExistingOrder(userId) {
    await openDatabase();
    try {
        const currentOrder = checkOrder(userId);
        const orderDetails = await db.all(`SELECT Products.type, Products.name, Products.cost, Products.image, 
            OrderDetails.quantity as quantity FROM OrderDetails LEFT JOIN Products 
            WHERE Products.product_id=OrderDetails.product_id`, [currentOrder.order_id]);
        return orderDetails;
    } catch(err) {
       console.log("Error in creating a new order: " + err);
    }
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

async function checkOrder(userId) {
    try {
        let currentOrder = await db.get(`SELECT Orders.order_id FROM Orders WHERE Orders.user_id=? AND status='New'`, [userId]);
        if (!currentOrder) {
            await db.run(`INSERT INTO Orders(user_id, shipping_address, order_date, status) VALUES (?,?,?,?)`,
                userId, "", "", "New");
            currentOrder = await db.get(`SELECT Orders.order_id FROM Orders WHERE Orders.user_id=? AND status='New'`, [userId]);
        }
        return currentOrder.order_id;
    } catch (err) {
        console.log("Error in checking order: " + err);
    }
}

module.exports = {
    add: addProductToCart,
    current: checkExistingOrder
}