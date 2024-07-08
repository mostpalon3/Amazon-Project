import { getProduct, loadProductsFetch } from "../data/products.js";
import { orders } from "../data/orders.js";

console.log(orders);
async function loadPage() {
  await loadProductsFetch();
  renderTrackingPage();
}
loadPage();

console.log(orders);
function renderTrackingPage() {
  let url = new URL(window.location.href);
  let orderId = url.searchParams.get('orderId');
  let productId = url.searchParams.get('productId');
  let matchingProduct = getProduct(productId);
  let matchingOrder;
  let matchingOrderProduct;
  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });
  matchingOrder.products.forEach((product) => {
    if (product.productId === productId) {
      matchingOrderProduct = product;
    }
  });
  console.log(matchingOrder);
  console.log(matchingOrderProduct);
  console.log(matchingOrderProduct.quantity);
  console.log(matchingProduct);

  const estimatedDate = new Date(matchingOrderProduct.estimatedDeliveryTime);
  const bookedDate = new Date(matchingOrder.orderTime);
  const estimatedDateString = `${estimatedDate.toLocaleString('default', { month: 'short' })} ${estimatedDate.getDate()}`;


  // Calculate time remaining in milliseconds
  const currentTime = new Date();
  const estimatedTime = estimatedDate.getTime();
  const createdAt = bookedDate.getTime();
  const timeRemaining = estimatedTime - currentTime.getTime();

  // Calculate percentage of time elapsed
  const totalDuration = estimatedTime - createdAt;
  const elapsedDuration = totalDuration - timeRemaining;
  let progressPercentage = (elapsedDuration / totalDuration) * 100;
  if(progressPercentage < 10){
    progressPercentage = 10;
  }

  const css = `
    .progress-bar {
        width:0px;
        height: 100%;
        background-color: green;
        border-radius: 50px;
        animation:progress-bar 2s ease-in-out 300ms forwards;
    }
    @keyframes progress-bar{
        from{
          width:0px
        }
        to{
          width: ${progressPercentage}%;
        }
    }
`;

  // Create a <link> element for tracking.css
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = 'styles/pages/tracking.css'; // Replace with the actual path to tracking.css

  // Inject <link> element into the <head> of the document
  document.head.appendChild(linkTag);

  // Now append the dynamically generated CSS rules to tracking.css
  linkTag.onload = function () {
    const styleTag = document.createElement('style');
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  };



  let trackingSummaryHTML = `      
        <div class="order-tracking">
        <a class="back-to-orders-link link-primary" href="orders.html">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${estimatedDateString}
        </div>

        <div class="product-info">
          ${matchingProduct.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingOrderProduct.quantity}
        </div>

        <img class="product-image" src=${matchingProduct.image}>

        <div class="progress-labels-container">
          <div class="progress-label">
            Preparing
          </div>
          <div class="progress-label current-status">
            Shipped
          </div>
          <div class="progress-label">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar"></div>
        </div>
      </div>`;
  document.querySelector('.js-main')
    .innerHTML = trackingSummaryHTML;
}