/*
 * Code to control products display on the shop page.
 */

const productsList = document.getElementById('products-list');
const searchBar = document.getElementById('search-bar');

/* A function to display page based on category chosen */
async function displayProducts(category) {
    const res = await fetch('/product-api');
    const data = await res.json();
    for (item of data) {
        console.log(item);
        const root = document.createElement('div');
        const name = document.createElement('h1');

        name.textContent = `${item.name}`;
    }
 }
 
 /* Setting filtering menu based on category chosen */
 function setFilterMenu() {
    var menu;
    return menu;
 }
 
 /* Setting list of products to display based on category chosen */
 function setList() {
    var list;
    return list;
 }