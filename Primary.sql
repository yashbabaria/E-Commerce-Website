BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "customers" (
	"customer_id"	INTEGER NOT NULL UNIQUE,
	"name"	TEXT,
	"address"	TEXT,
	"Date of Birth"	TEXT,
	"City"	TEXT,
	"State"	TEXT,
	"Country"	TEXT,
	"Postal Code"	NUMERIC,
	"Email"	TEXT,
	"Username"	TEXT,
	"Password"	TEXT,
	PRIMARY KEY("customer_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "employees" (
	"employee_id"	INTEGER NOT NULL UNIQUE,
	"Name"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("employee_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Order" (
	"Order_ID"	INTEGER NOT NULL UNIQUE,
	"Customer_ID"	INTEGER,
	"Shipping_Date"	TEXT,
	PRIMARY KEY("Order_ID" AUTOINCREMENT),
	FOREIGN KEY("Customer_ID") REFERENCES "customers"("customer_id")
);
CREATE TABLE IF NOT EXISTS "OrderDetails" (
	"Order_ID"	INTEGER NOT NULL UNIQUE,
	"Product_ID"	INTEGER,
	"Quantity"	INTEGER,
	PRIMARY KEY("Order_ID" AUTOINCREMENT),
	FOREIGN KEY("Order_ID") REFERENCES "Order"("Order_ID"),
	FOREIGN KEY("Product_ID") REFERENCES "Product"("Product_Id")
);
CREATE TABLE IF NOT EXISTS "Product" (
	"Product_Id"	INTEGER,
	"Name_of_Product"	TEXT,
	"Type_of_Product"	TEXT,
	"Description"	TEXT,
	"Cost"	INTEGER,
	"Approved"	TEXT,
	PRIMARY KEY("Product_Id")
);
COMMIT;