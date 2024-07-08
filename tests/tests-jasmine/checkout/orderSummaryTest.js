import { renderOrderSummary } from "../../../script/checkout/orderSummary.js";
import { loadFromStorage, cart } from "../../../data/cart.js";
import { loadProducts,loadProductsFetch } from "../../../data/products.js";

describe("test suite: renderOrderSummary", () => {
//by using hook we can run some common code before each of the test in this suite
const productId1 = "54e0eccd-8f36-462b-b68a-8182611d9add";
const productId2 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
beforeAll((done) => {
  loadProductsFetch().then(() => {//since it returns promise
    done();
  })

  // loadProducts(() => {
  //   done();//jasmine have a function to wait : done(), if we dont call it we will be waiting forever
  //   //so it will load after the response of product comes and run done() function to move further
  //   //done can be used inside beforeEach and it also 
  // });//it is asynchronous so it doesnt wait for response and move on next code
});
beforeEach(() => {
    spyOn(localStorage, 'setItem');

    document.querySelector(
      ".js-test-container"
    ).innerHTML = `<div class = "js-order-summary"></div>
    <div class = "js-payment-summary"></div>
    <div class = "js-checkout-header"></div>`; //we needed to add this since delete button ran renderPaymentSummary and renderCheckoutSummary which in turn was running the code for adding html using dom in these classes , so to fake run the code here we need to create the class here

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: productId1,
          quantity: 2,
          deliveryOptionId: 1,
        },
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "3",
        },
        {
          productId: productId2,
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });
    loadFromStorage();//was for loading the cart again after mocking

    renderOrderSummary();
    //when we click delete it runs a function removeFromCart() which in turn runs saveToStorage, so we dont want this fake up to get saved in local storage so we will mockup the set item 
});
afterEach(() => {//removes the html after the test
    document.querySelector(
        ".js-test-container"
      ).innerHTML = ``;
});

  it("display the cart", () => {
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      3
    );
    //but below class have many HTML inside it , so we will use innerText and a method toContain
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain("Quantity: 2"); //it doesnt have to match exactly, astleast these words should be inside there somewhere
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain("Quantity: 2");
  });

  it("removes a product", () => {

    document.querySelector(`.js-delete-link-${productId1}`).click(); //click this delete link to remove from the cart, so we will use this method to click delete
    expect(document.querySelectorAll(".js-cart-item-container").length).toEqual(
      2 //on clicking the delete button with that specific class one should get deleted from the three product so 2 should be left
    );
    expect(
    document
      .querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null); //this is dom selection for the deleted product
    expect(
    document
      .querySelector(`.js-cart-item-container-${productId2}`))
      .not.toEqual(null);

    expect(cart.length).toEqual(2);
    expect(cart[0].productId).toEqual(productId2);
  }); //and in jasmine for not the method is as shown above, which is checking if the product2 exist as it hadnt been deleted
});
