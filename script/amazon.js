import { addToCart, buyNow, calculateCartQuantity, renderCart } from "../data/cart.js";
//another syntax for this
//import * cartModule from '../data/cart.js';
//cartModule.cart
// cartModule.addToCart('id');
import { products, loadProducts } from "../data/products.js";
import { searchButtonAction, searchedProduct, searchingProduct } from "./searchEngine.js";
//but this work only on live server, not when you are directly running from the file
//but still we cant use this variable again , but now we know which variable is conflicting
//but to overcome that we have a feature where we import the variable and change its name
//import {cart as myCart} from '../data/cart.js';
//this will take the input and rename it so that it does not conflict with the cart variable below
// const cart = [];

loadProducts(renderProductsGrid);
//Http requests are asynchronous, it will take time for the message to go and travel back to give the response,the products havent loaded yet and with that we are loading this amazon home page(or say the productsHTML ran before the products came so we need to run the productsHTML after the products load from the backend),so we need to wait for http request to finish first and response to combeack then we load this page
//so we can load this page in function after load of response in product.js

calculateCartQuantity(".js-cart-quantity"); //loading the cart at loading of the page


async function renderProductsGrid() {
  let productsHTML = "";
  let filteredProduct = products;
  let productSearched = await searchingProduct()
  console.log(productSearched);
  if (productSearched){
    filteredProduct = productSearched;
  }


  filteredProduct.forEach((product) => {
    productsHTML += `<!-- yha par + isiliye taaki saara html acumulate ho har baari naa kee har array  value par update ho bas -->
            <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
          ${product.name}
          </div>

          <div class="product-rating-container">
          <!-- Here instead of calculating stars here we are gonna use class property instead -->
            <img class="product-rating-stars"
              src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
            ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
          ${product.getPrice()}<!-- here to show to show price to decimal number we will use a inbuilt method 'toFixed(n)' where n is the number of places for the decimal to show  -->
          </div>

          <div class="product-quantity-container">
    <select class="js-quantity-selector-${product.id}">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
          </div>
<!-- polymorphism = use a method without knowing the class, it is alternative to use if-statements 
# the class here itself determine what this method does like if its not a clothing product it will give empty value but if the it is then the link 
-->
          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart "
          data-product-id = "${product.id}">
          <!-- here this creates a data attribute for the button -->
            Add to Cart
          </button>
          <button class="add-to-cart-button button-secondary js-buy-now "
          data-product-id = "${product.id}">
          <!-- here this creates a data attribute for the button -->
            Buy Now
          </button>
        </div>
    `;
  });
  let select = document.querySelector(".js-product-grid");
  select.innerHTML = productsHTML;

  let clearId;
  function addedPreview(productId) {
    clearTimeout(clearId);
    const selector = document.querySelector(`.js-added-cart-${productId}`);
    selector.classList.add("added-opacity");
    clearId = setTimeout(() => {
      selector.classList.remove("added-opacity");
    }, 1000);
  }

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const { productId } = button.dataset;
      addToCart(productId);
      calculateCartQuantity(".js-cart-quantity"); //defined in cart.js (its best practice to define the things in their own file)
      addedPreview(productId);
    });
  });
  document.querySelectorAll('.js-buy-now')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        buyNow(productId);
        window.location.href = 'checkout.html?para=true';
      }
      );
    });
}
searchButtonAction();
