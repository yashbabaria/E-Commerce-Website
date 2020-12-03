-- Up
CREATE TABLE IF NOT EXISTS "AuthTokens" (
	"auth_id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"token"	TEXT NOT NULL,
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id"),
	PRIMARY KEY("auth_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Users" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"first_name"	TEXT NOT NULL,
	"last_name"	TEXT NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"email"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"account_type"	TEXT NOT NULL,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "UserDetails" (
	"user_id"	INTEGER NOT NULL UNIQUE,
	"address"	TEXT,
	"city"	TEXT,
	"state"	TEXT,
	"country"	TEXT,
	"zip"	NUMERIC,
	FOREIGN KEY("user_id") REFERENCES "UserDetails"("user_id"),
	PRIMARY KEY("user_id")
);
CREATE TABLE IF NOT EXISTS "Reviews" (
	"product_id" INTEGER NOT NULL,
	"review_id"	INTEGER NOT NULL,
	"reviewer_id"	NUMERIC NOT NULL,
	"content"	TEXT,
	"rating"	INTEGER NOT NULL,
	FOREIGN KEY("reviewer_id") REFERENCES "Users"("user_id"),
	PRIMARY KEY("review_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Products" (
	"product_id"	INTEGER UNIQUE,
	"seller_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL UNIQUE,
	"type"	INTEGER NOT NULL,
	"description"	TEXT,
	"cost"	INTEGER NOT NULL,
	"status"	TEXT NOT NULL,
	"image"	TEXT,
	"rating"	INTEGER,
	"review_number"	INTEGER,
	FOREIGN KEY("seller_id") REFERENCES "Users"("user_id"),
	PRIMARY KEY("product_id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "OrderDetails" (
	"order_id"	INTEGER NOT NULL,
	"product_id" INTEGER NOT NULL,
	"quantity"	INTEGER NOT NULL,
	FOREIGN KEY("product_id") REFERENCES "Products"("product_id"),
	FOREIGN KEY("order_id") REFERENCES "Orders"("order_id")
);
CREATE TABLE IF NOT EXISTS "Orders" (
	"order_id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"shipping_address"	TEXT NOT NULL,
	"order_date"	TEXT NOT NULL,
	"status"	TEXT NOT NULL,
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id"),
	PRIMARY KEY("order_id")
);

-- Down
DROP TABLE AuthTokens;
DROP TABLE Users;
DROP TABLE UserDetails;
DROP TABLE Reviews;
DROP TABLE Products;
DROP TABLE Orders;
DROP TABLE OrderDetails;