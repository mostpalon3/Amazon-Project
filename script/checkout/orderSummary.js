//namedexport
import { cart, removeFromCart, updateQuantity, updateDeliveryOption, para } from "../../data/cart.js";//.. represents outside the folder
import { products,getProduct } from "../../data/products.js";
import { formatCurrency } from "../Utils/money.js";
// import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
//default Export - another way of exporting 
//we can say use it when we only want to export 1 thing
//see an example done in utils folder 
//dayjs use default export
//not every library have esm version(see `checkout.html` for reference)
import { deliveryOption, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckouHeader } from "./checkoutHeader.js";

// hello();
// const today = dayjs();
// //dayjs() have some its own method , some of which we are using below 
// const deliveryDate = today.add(7, 'day');
// const date = deliveryDate.format('dddd, MMMM D'); //here space has value so if u want space then put the space
// console.log(date);
// console.log(deliveryDate);
export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct = getProduct(productId);

    //To show the delivery date at the top
    //here we will get the object from delivaryOption array that is matching with the cartItem and save it in deliveryOptions, and used that delivaryOptions to calculate date as we did for radio selector , but used that inside the function(refer to it little below this page)

    const deliveryOptionId = cartItem.deliveryOptionId;

    //yha ek product k specific deliveryoptionid se ham uski date upar head par print karenge ....whi neeche yhi similar cheez kee thee for radio selector but that was for every option aur yha bas wo selected option k liye isliye ham deliveryoption array wo wla option search krenge uss specific cartitem k liye
    const deliveryOptions = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOptions.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    )

    cartSummaryHTML += `
              <div class="cart-item-container 
             js-cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${matchingProduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                <!-- now the matchingProduct is an enhanced object made from class -->
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link js-update-link-${matchingProduct.id}" data-product-id ="${matchingProduct.id}">
                    Update           
                    </span>
                    <input class = "quantity-input quantity-input-${matchingProduct.id}" data-product-id ="${matchingProduct.id}"> 
                    <span class = "link-primary save-quantity-link" data-product-id ="${matchingProduct.id}">Save </span>
                  <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id ="${matchingProduct.id}" >
                    Delete
                  </span>
                </div>
              </div>
<!-- we needed to have different name for each product's radio selector , since we can choose from one of the radio selector with same name so only raio selector with the same name should be of that product and the html generated for each product should have different radio name -->
              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;
  });
  const cartBox = document.querySelector('.js-order-summary');
  cartBox.innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId,para);
        // const container = document.querySelector(`.js-cart-item-container-${productId}`);
        // container.remove();
        renderOrderSummary();//after deleting from the cart , instead of updating the the html using DOM we use this recursion to regenerate the html again 
        renderPaymentSummary();//to update the payment summary here 

        emptyCart();
        renderCheckouHeader();
        // calculateCartQuantity('.js-checkout');
        //calculateCartQuantity('.js-payment-item');
        //renderPaymentSummary me already run horha
        //updating item in payment section

      });
    })
  //we are writing the function to delete in cart.js

  //showing the empty cart msg so we need to call this function the moment the cart is deleted, so we called it inside the evenlistener of the delete button and when the page loads as called below
  emptyCart();
  function emptyCart() {
    const cartSelector = document.querySelector('.js-order-summary');
    if (cart.length === 0) {
      cartSelector.innerHTML = 'Your cart is empty';
    }
  }
  // calculateCartQuantity('.js-checkout');//since we are loading it bt rendercheckoutheader in checkout.js

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`)
        container.classList.add('is-editing-quantity');
        document.querySelector(`.js-update-link-${productId}`)
          .innerText = '';
      });
    });
  document.querySelectorAll('.save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const newQuantity = Number(document.querySelector(`.quantity-input-${productId}`).value);
        updateQuantity(productId, newQuantity,para);
        renderPaymentSummary();//to update the payment section
        //calculateCartQuantity('.js-payment-item');
        //iski jarurat nai since upar wle function me ye already run horha
        //dekho renderPaymentsummary html generate kr rha to uske baad hi ye wla function run kar skte hai apan nai to nai chlega
      });
    })
  document.querySelectorAll('.quantity-input')
    .forEach((link) => {
      link.addEventListener('keydown', (event) => {
        const productId = link.dataset.productId;
        const newQuantity = Number(document.querySelector(`.quantity-input-${productId}`).value);
        if (event.key === 'Enter')
          updateQuantity(productId, newQuantity,para);
        renderPaymentSummary();
      })
    });
  //Now,we will code for delivery options:
  //here we delivery option is default , but to change the price and the time for delivery we will do it by normalising the data 
  //for that we will create data file with name deliveryOption


  //1.Loop through deliveryOptions
  //2.For each option,generate some HTML
  //3.Combine the HTML together
  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOption.forEach((deliveryOptions) => {
      const today = dayjs();//to get todays date
      const deliveryDate = today.add(
        deliveryOptions.deliveryDays, 'days' //getting no of days from the object saved in deliveryOptions
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      )
      const priceString = deliveryOptions.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOptions.priceCents)} -`;

      const isChecked = deliveryOptions.id === cartItem.deliveryOptionId;

      html +=
        `
  <div class="delivery-option js-delivery-option"
  data-product-id = "${matchingProduct.id}"
  data-delivery-option-id = "${deliveryOptions.id}">
    <input type="radio" 
    ${isChecked ? 'checked' : ''}
    class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
    <div>
      <div class="delivery-option-date">
        ${dateString}
      </div>
      <div class="delivery-option-price">
        ${priceString} Shipping
      </div>
    </div>
  </div>`
    });

    return html;
  }
  //by using dataset we are taking the productId and deliveryOptionId out which is saved into that products object inside the cart array with help of savestorage inside the function updateDeliveryOption
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId,para);
        renderOrderSummary();
        renderPaymentSummary();
        //calling a function inside itself is called recursion
      })
    });
}
//here when we click the option it needs to update the date at the head , which needs injection by DOM method , but thats good for fewer updation but if there are numerous places where after the click it needds to pe updated , then we have to find a way to update all the code by rerunning so the html that we are genrating get generated with the fresh and updated code so thats why we put all the html generator inside a function and call it inside the event listener and also outside one time 
// MVC - model-view-control => 1.Update the data 2. Regenerate all the HTML.
//Split our code into 3 parts
//1.Model = saves and manages the data eg.cart.js
//2.view = takes the data and displays it on the page eg. checkout.js , it takes the data and generate html to view it on page 
//3.controller = runs some code when we interact with the page eg. the bottom of checkout.js where the evenlin=steners runs the code when we interact with the page //and at the end the controller will update the model which in turn updates the view 
//MVC makes sure the page always matches the data also knows as design pattern
