import { orders } from "../data/orders.js"
import formatCurrency from "../script/Utils/money.js"
import { getProduct, products, loadProductsFetch } from "../data/products.js";
import { calculateCartQuantity } from "../data/cart.js";

let clickedId;
let clickedOrderId;

async function loadPage() {
    await loadProductsFetch();
    renderOrderPage();
    calculateCartQuantity('.js-order-cart');
    loadTrackingURL();
}
loadPage();


function renderOrderPage() {
    let orderFinalSummaryHTML = '';
    orders.forEach((order) => {
        const orderId = order.id;
        const totalCostCents = order.totalCostCents;
        // const orderTime = order.orderTime;
        const orderDate = new Date(order.orderTime);
        const orderDateString = `${orderDate.toLocaleString('default', { month: 'short' })} ${orderDate.getDate()}`;
        let orderProductSummaryHTML = '';
        console.log(order);
        order.products.forEach(async (product) => {
            const productId = product.productId;
            const quantity = product.quantity;
            const estimatedDate = new Date(product.estimatedDeliveryTime);
            const estimatedDateString = `${estimatedDate.toLocaleString('default', { month: 'short' })} ${estimatedDate.getDate()}`;
            let matchingProduct;
            products.forEach((product) => {
                if (product.id === productId) {
                    matchingProduct = product;
                }
            });

            orderProductSummaryHTML += `
            <div class="product-image-container">
              <img src=${matchingProduct.image}>
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${estimatedDateString}
              </div>
              <div class="product-quantity">
                Quantity: ${quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
                <button class="track-package-button button-secondary js-button-secondary" data-clicked-id = "${matchingProduct.id}"
                data-clicked-order-id = "${orderId}">
                  Track package
                </button>
            </div>
    `;
        });


        orderFinalSummaryHTML += `
            <div class="order-container">

          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDateString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${orderId}</div>
            </div>
          </div>
          <div class="order-details-grid">
          ${orderProductSummaryHTML}
          </div>
        </div>
    `;
    });
    document.querySelector('.js-orders-grid')
        .innerHTML = orderFinalSummaryHTML;
}

function loadTrackingURL() {
    document.querySelectorAll('.js-button-secondary')
        .forEach((link) => {
            link.addEventListener('click', () => {
                clickedId = link.dataset.clickedId;
                clickedOrderId = link.dataset.clickedOrderId;
                console.log(clickedId);
                console.log(clickedOrderId);
                window.location.href = `tracking.html?orderId=${clickedOrderId}&productId=${clickedId}`
            })
        })
}