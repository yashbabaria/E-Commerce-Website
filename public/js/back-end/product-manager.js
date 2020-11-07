/*
 * Code for adding, updating, and deleting products from the store and product database.
 */

 const sqlite3 = require('sqlite3').verbose();
 let products = [];
 let db = null;

 /* A function to open database */
 function openDatabase() {
    db = new sqlite3.Database('Primary.sqlite', sqlite3.OPEN_READWRITE, (err) => {
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

/* A function to add a new product to the product database */
function addProductToStore(name, type="", description="", cost=0) {
    openDatabase();
    db.serialize(() => {
        let sql = "INSERT INTO Product (Name_Of_Product, Type_Of_Product," +
            " Description, Cost, Approved) VALUES (?,?,?,?,?)";
        db.run(sql, [name, type, description, cost, 'Pending'], (err) => {
            if (err) throw err;
            console.log(name + " is added to the list.");
        });
      });
    closeDatabase();
}

/* A function to update a product in the product database */
function updateProductInStore(id, name, newName=null, newType=null, newDescription=null, newCost=null) {
    openDatabase();
    if (newName != null) updateProductName(id, name, newName);
    if (newType != null) updateProductType(id, name, newType);
    if (newDescription != null) updateProductDescription(id, name, newDescription);
    if (newCost != null) updateProductCost(id, name, newCost);
    closeDatabase();
}

/* A function to update a product's name in the product database */
function updateProductName(id, name, newName) {
    db.serialize(() => {
        let sql = "UPDATE Product SET Name_Of_Product=? WHERE Product_Id=?";
        db.run(sql, [newName, id], (err) => {
            if (err) throw err;
            console.log(name + "'s name is updated to " + newName + ".");
        });
      });
}

/* A function to update a product's tpe in the product database */
function updateProductType(id, name, newType) {
    db.serialize(() => {
        let sql = "UPDATE Product SET Type_Of_Product=? WHERE Product_Id=?";
        db.run(sql, [newType, id], (err) => {
            if (err) throw err;
            console.log(name + "'s type is updated.");
        });
      });
}

/* A function to update a product's description in the product database */
function updateProductDescription(id, name, newDescription) {
    db.serialize(() => {
        let sql = "UPDATE Product SET Description=? WHERE Product_Id=?";
        db.run(sql, [newDescription, id], (err) => {
            if (err) throw err;
            console.log(name + "'s description is updated.");
        });
      });
}

/* A function to update a product's cost in the product database */
function updateProductCost(id, name, newCost) {
    db.serialize(() => {
        let sql = "UPDATE Product SET Cost=? WHERE Product_Id=?";
        db.run(sql, [newCost, id], (err) => {
            if (err) throw err;
            console.log(name + "'s cost is updated.");
        });
      });
}

/* A function to update a product's status in the product database */
function updateProductStatus(id, name, newStatus) {
    openDatabase();
    db.serialize(() => {
        let sql = "UPDATE Product SET Approved=? WHERE Product_Id=?";
        db.run(sql, [newStatus, id], (err) => {
            if (err) throw err;
            console.log(name + "'s status is updated.");
        });
      });
    closeDatabase();
}

/* A function to delete a product from the product database */
function deleteProductFromStore(id, name) {
    openDatabase();
    db.serialize(() => {
        let sql = "DELETE FROM Product WHERE Product_Id=?";
        db.run(sql, [id], (err) => {
            if (err) throw err;
            console.log(name + " is deleted.");
        });
      });
    closeDatabase();
}

/* A function to load all products */
function loadProducts(category) {
    openDatabase();
    db.serialize(() => {
        let sql = `SELECT Name_Of_Product name,
                          Cost cost
                          FROM Product`;
        switch (category) {
            case 'Mask':
                sql += " WHERE Type_Of_Product='Mask'";
                break;

            case 'PPE':
                sql += " WHERE Type_Of_Product='PPE'";
                break;

            case 'Essentials':
                sql += " WHERE Type_Of_Product='Essentials'";
                break;

            case 'Pharm':
                sql += " WHERE Type_Of_Product='Pharm'";
                break;

            case 'Other':
                sql += " WHERE Type_Of_Product='Other'";
        }

        sql += " ORDER BY Name_Of_Product";
        
        db.all(sql, (err, rows) => {
            if (err) throw err;

            if(rows){
                rows.forEach(product => {                    
                    products.push({name:product.name, cost:product.cost});
                });
            } else {
                console.log("There is no product in the store.");
            }
        });
      });
    
    closeDatabase();
    return products;
}

addProductToStore('Some');
loadProducts('All');
deleteProductFromStore(1, 'Some');

