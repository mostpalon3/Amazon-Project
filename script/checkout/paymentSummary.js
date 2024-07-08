import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../Utils/money.js";//since its default import
import { addOrder } from "../../data/orders.js";


//steps
//1.Loop through the cart 
//2.For each product price*quantity
//3.Add everything together
export function renderPaymentSummary(){
let productPriceCents = 0;
let deliveryFee = 0;

     cart.forEach((cartItem) => {
        const productId = cartItem.productId;
        const product = getProduct(productId);
        productPriceCents += product.priceCents * cartItem.quantity;

        const deliveryOptions = getDeliveryOption(cartItem.deliveryOptionId);
        deliveryFee += deliveryOptions.priceCents;

     });

     const totalBeforeTaxCents = productPriceCents + deliveryFee;
     const taxCents = totalBeforeTaxCents * 0.1;
     const totalCents = totalBeforeTaxCents + taxCents;

     let cartQuantity = 0;
     cart.forEach((cartItem) => {
         cartQuantity += cartItem.quantity;
     });

     //here we are generating the html but unlikely the previous generation we are not accumulating the HTML , we are just overwriting the HTML for each cartItem 
     let paymentSummaryHTML = `
        <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(deliveryFee)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
     `;
     document.querySelector('.js-payment-summary')
     .innerHTML = paymentSummaryHTML;

    //  calculateCartQuantity('.js-payment-item');//jab jab ye render hoga tab tab item kee value calculate hogi
    document.querySelector('.js-place-order')
    .addEventListener('click', async () =>{//now we need to get the response , so we will get it by async await 
      //we request backend to create orders
      //we need to send cart to backend
      //a backend is created to process the order by supersimpledev
      try{
      const response = await  fetch('https://supersimplebackend.dev/orders',{//now we will wait for response after sending the post request
        //since await returns we will save it in var
        method: 'POST', 
        //headers gives the backend more info about our request
        headers: {
          'Content-Type': 'application/json'//add the property
        },
        body:JSON.stringify({
          cart: cart //cart should be present,according to documentation of the url we need to send cart arrray
          //we cannot semd object directly in our request, convert into json 
        })
      });

      const order = await response.json();//response.json is also a promise, so use await
      console.log(order);
      addOrder(order);

    } catch(error){
      console.log('Unexpected error')
    }

    //after we create a object we should go to order page
    //location is special object provided by js that let us control the url of the browser, if we change the location we change the url 
    //href gives the url of the browser
    window.location.href = 'orders.html';//it will replace the url after / , it is file path
    //the current file is checkout.html and it will look for the file orders.html
    localStorage.removeItem('cart');

    });
}

//instead of creating the order on the computer , we send it to create at backend 
