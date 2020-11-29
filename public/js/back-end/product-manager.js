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
async function addProductToStore(name, type="", description="", cost=0, image="") {
    await openDatabase();
    const item = {
        productName: name, 
        productType: type, 
        desc: description,
        price: cost
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    };
    fetch('/product-api', options);

    let sql = `INSERT INTO Products(name, type, description, cost, status, 
        image, rating, review_number) VALUES (?,?,?,?,?,?,?,?)`;
    await db.run(sql, [name, type, description, cost, 'Pending', image, 0, 0], (err) => {
        if (err) throw err;
        console.log(name + " is added to the list.");
    });
    
}

/* A function to update a product in the product database */
async function updateProductInStore(id, name, newName=null, newType=null, newDescription=null, newCost=null) {
    await openDatabase();
    if (newName != null) updateProductName(id, newName);
    if (newType != null) updateProductType(id, newType);
    if (newDescription != null) updateProductDescription(id, newDescription);
    if (newCost != null) updateProductCost(id, newCost);
    
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
async function loadProducts(category) {
    await openDatabase();
    let sql = `SELECT name name,
                        cost cost
                        FROM Products`;
    switch (category) {
        case 'Mask':
            sql += " WHERE type='Mask'";
            break;

        case 'PPE':
            sql += " WHERE type='PPE'";
            break;

        case 'Essentials':
            sql += " WHERE type='Essentials'";
            break;

        case 'Pharm':
            sql += " WHERE type='Pharm'";
            break;

        case 'Other':
            sql += " WHERE type='Other'";

        default:
    }

    sql += " ORDER BY name";
    
    const products = await db.all(sql);
    return products;
}

module.exports = {
    add: addProductToStore,
    update: updateProductInStore,
    updateStatus: updateProductStatus,
    delete: deleteProductFromStore,
    load: loadProducts
};