BEGIN TRANSACTION;
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
	"Name_Of_Product"	TEXT NOT NULL UNIQUE,
	"Type of Product"	TEXT,
	"Description"	TEXT,
	"Cost"	INTEGER,
	"Approved"	TEXT,
	"Review"	TEXT,
	"Image"	TEXT,
	PRIMARY KEY("Product_Id")
);
CREATE TABLE IF NOT EXISTS "Review" (
	"Customer_Id"	NUMERIC NOT NULL,
	"Description"	TEXT,
	"Rating"	INTEGER,
	PRIMARY KEY("Customer_Id"),
	FOREIGN KEY("Customer_Id") REFERENCES "customers"("customer_id")
);
CREATE TABLE IF NOT EXISTS "customers" (
	"customer_id"	INTEGER NOT NULL UNIQUE,
	"firstname"	TEXT,
	"lastname"	TEXT,
	"Email"	TEXT,
	"Username"	TEXT,
	"Password"	TEXT,
	PRIMARY KEY("customer_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "customer_private" (
	"customer_id"	INTEGER NOT NULL UNIQUE,
	"Home_Address"	TEXT,
	"Billing_Address"	TEXT,
	"Apartment_Address"	TEXT,
	"City"	TEXT NOT NULL,
	"State"	TEXT NOT NULL,
	"Country"	TEXT,
	"Postal_Code"	INTEGER NOT NULL,
	PRIMARY KEY("customer_id"),
	FOREIGN KEY("customer_id") REFERENCES "customers"("customer_id")
);
INSERT INTO "customers" VALUES (1,'Yash','Babaria','ybabaria@asu.edu','YashMilk','super980');
INSERT INTO "customers" VALUES (2,'Jase','Pippe','yoshieg.babaria@gmail.com','Youngin','never');
COMMIT;
