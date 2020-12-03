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
    try {
        var currentOrder = await checkOrder(userId);
        const productPrice = await db.get('SELECT cost FROM Products WHERE product_id=?', [productId]);
        await db.run(`INSERT INTO OrderDetails(order_id, product_id, quantity, subtotal) VALUES (?,?,?,?)`,
            [currentOrder.order_id, productId, 1, productPrice.cost]);
        const currentTotal = await db.get('SELECT total FROM Orders WHERE order_id=?', [currentOrder.order_id]);
        let newTotal = currentTotal.total + productPrice.cost;
        await db.run(`UPDATE Orders SET total=? WHERE order_id=?`, [newTotal, currentOrder.order_id]);
        console.log("Add to cart: {" + productId + "}");
    } catch(err) {
       console.log("Error in adding to cart: " + err);
    }
}

 /* A function to update a product in the cart */
 async function checkExistingOrder(userId) {
    await openDatabase();
    try {
        const currentOrderId = await checkOrder(userId);
        const orderDetails = await db.all(`SELECT Products.product_id, Products.type, Products.name, Products.cost, Products.image, 
            OrderDetails.subtotal, OrderDetails.quantity as quantity FROM OrderDetails LEFT JOIN Products 
            WHERE Products.product_id=OrderDetails.product_id AND OrderDetails.order_id=?`, [currentOrderId.order_id]);
        return orderDetails;
    } catch(err) {
       console.log("Error in creating a new order: " + err);
    }
}

 /* A function to delete a product from the cart */
 async function deleteProductFromCart(userId, productId) {
    await openDatabase();
    const orderId = await db.get('SELECT order_id FROM Orders WHERE status="New" AND user_id=?', [userId]);
    const priceDeducted = await db.get('SELECT subtotal FROM OrderDetails WHERE product_id=? AND order_id=?', [productId, orderId.order_id]);
    const currentTotal = await db.get('SELECT total FROM Orders WHERE order_id=?', [orderId.order_id]);
    const newTotal = currentTotal.total - priceDeducted.subtotal;
    await db.run('UPDATE Orders SET total=? WHERE order_id=?', [newTotal, orderId.order_id]);
    await db.run("DELETE FROM OrderDetails WHERE product_id=? AND order_id=?", [productId, orderId.order_id]);
}

async function checkOrder(userId) {
    try {
        let currentOrder = await db.get(`SELECT order_id, total FROM Orders WHERE status="New" AND Orders.user_id=?`, [userId]);
        if (!currentOrder) {
            await db.run(`INSERT INTO Orders(user_id, shipping_address, order_date, status, total) VALUES (?,?,?,?,?)`,
                userId, "", "", "New", 0);
            currentOrder = await db.get(`SELECT Orders.order_id FROM Orders WHERE Orders.user_id=? AND status='New'`, [userId]);
        }
        return currentOrder;
    } catch (err) {
        console.log("Error in checking order: " + err);
    }
}

module.exports = {
    add: addProductToCart,
    cart: checkExistingOrder,
    current: checkOrder,
    delete: deleteProductFromCart
}