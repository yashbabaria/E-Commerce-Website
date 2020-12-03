/*
 * Code for adding, updating, and deleting products from the store and product database.
 */
const dbPromise = require('../../../index'); 

 /* A function to open database */
 async function openDatabase() {
    try { 
        db = await dbPromise.dbPromise; 
        console.log("Connected to product database");
    } catch { 
        console.log("Database error");
    }
}

/* A function to add a new product to the product database */
async function addProductToStore(name, seller_id, type, description="", cost, image="") {
    await openDatabase();
    if (name, seller_id, cost) {
        await db.run(`INSERT INTO Products(name, seller_id, type, description, cost, status, 
            image, rating, review_number) VALUES (?,?,?,?,?,?,?,?,?)`,
            name, seller_id, type, description, cost, "Waiting for Approval", image, 0, 0);
        console.log("Add product: {" + name + " " + type + " " + description + " "+ cost + " "+ image + "}");        
        return;
    } else {
        return "Please fill out all forms with valid inputs";
    }
    
}

/* A function to update a product in the product database */
async function updateProductInStore(id, newName=null, newType=null, newDescription=null, newCost=null, newImage=null) {
    await openDatabase();
    if (newName != null) updateProductName(id, newName);
    if (newType != null) updateProductType(id, newType);
    if (newDescription != null) updateProductDescription(id, newDescription);
    if (newCost != null) updateProductCost(id, newCost); 
    if (newImage != null) updateProductImage(id, newImage); 
}

/* A function to update a product's name in the product database */
async function updateProductName(id, newName) {
    let sql = "UPDATE Products SET name=? WHERE product_id=?";
    await db.run(sql, [newName, id], (err) => {
        if (err) throw err;
        console.log(name + "'s name is updated to " + newName + ".");
    });
}

/* A function to update a product's tpe in the product database */
async function updateProductType(id, newType) {
    let sql = "UPDATE Products SET type=? WHERE product_id=?";
    await db.run(sql, [newType, id], (err) => {
        if (err) throw err;
        console.log(name + "'s type is updated.");
    });
}

/* A function to update a product's description in the product database */
async function updateProductDescription(id, newDescription) {
    let sql = "UPDATE Products SET description=? WHERE product_id=?";
    await db.run(sql, [newDescription, id], (err) => {
        if (err) throw err;
        console.log(name + "'s description is updated.");
    });
}

/* A function to update a product's cost in the product database */
async function updateProductCost(id, newCost) {
    let sql = "UPDATE Products SET cost=? WHERE product_id=?";
    await db.run(sql, [newCost, id], (err) => {
        if (err) throw err;
        console.log(name + "'s cost is updated.");
    });
}

/* A function to update a product's status in the product database */
async function updateProductStatus(id, newStatus) {
    await openDatabase();
    let sql = "UPDATE Products SET status=? WHERE product_id=?";
    await db.run(sql, [newStatus, id], (err) => {
        if (err) throw err;
        console.log(name + "'s status is updated.");
    });
    
}

/* A function to update a product's image path in the product database */
async function updateProductImage(id, newImage) {
    await openDatabase();
    let sql = "UPDATE Products SET image=? WHERE product_id=?";
    await db.run(sql, [newImage, id], (err) => {
        if (err) throw err;
        console.log(name + "'s image is updated.");
    });
    
}

/* A function to delete a product from the product database */
async function deleteProductFromStore(id) {
    await openDatabase();
    let sql = "DELETE FROM Products WHERE product_id=?";
    await db.run(sql, [id], (err) => {
        if (err) throw err;
        console.log(name + " is deleted.");
    });
    
}

/* A function to load all products */
async function loadProducts(constraint=null, param=null) {
    await openDatabase();
    var products;
    var sql = `SELECT Products.product_id, Products.name, Products.type, Products.description, Products.cost,
        Products.status, Products.image, Products.rating, Products.review_number, 
        Users.username as seller
        FROM Products LEFT JOIN Users WHERE Products.seller_id=Users.user_id `;
    if (constraint && param) {
        sql += constraint;
        sql +=" ORDER BY Products.name";
        products = await db.all(sql, param);
    } else {
        sql +=" ORDER BY Products.name";
        products = await db.all(sql);
    }
    return products;
}

module.exports = {
    add: addProductToStore,
    update: updateProductInStore,
    updateStatus: updateProductStatus,
    delete: deleteProductFromStore,
    load: loadProducts
};