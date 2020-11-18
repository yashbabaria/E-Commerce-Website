/*
 * Code to control products display on the shop page.
 */

const productsList = document.getElementById('products-list');
const searchBar = document.getElementById('search-bar');

/* A function to display page based on category chosen */
function displayProducts(category) {
    loadProducts(category);
    return htmlString = products.map((product) => {
        return `
        <li class="product">
            <h2>${product.name}</h2>
            <p>Price: ${product.cost}</p>
            
        </li>
        `;
    })
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