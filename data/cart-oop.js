import { renderCheckouHeader } from "../script/checkout/checkoutHeader.js";

//OOPs - Object-oriented-Programming - another style of programming
//Organizing our code into objects

//Previously we were doing procedural programming = a set of step-by-step instructions which is basically a function

//we cant use export inside the onject
//function inside a object becomes method , here we are writing in shorthand form

//Why do we use OOP , it tries to represent the real world
//in this it represent a physical object into digital object
//a physical cart can have product inside so does are js object does
//in physical cart we can remove or add product inside so in js object
//this make the code easier to understand

//for generating object in oops we use CamelCase for naming
function Cart(localStorageKey) {
  const cartObject = {
    cart: undefined,

    loadFromStorage() {
      //we are using this in place of Object name , so in future if we change the name of object we dont have to change this aas it points to object irrespective of name
      this.cart = JSON.parse(localStorage.getItem(localStorageKey)); //here we are saving it in different string so we dont affect the original cart

      if (!this.cart) {
        this.cart = [
          {
            productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
            quantity: 2,
            deliveryOptionId: "3",
          },
          {
            productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
            quantity: 1,
            deliveryOptionId: "2",
          },
        ];
      }
    },

    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cart));
    },

    addToCart(productId) {
      let matchingItem;
      this.cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      let selectorValue = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      let quantity;
      if (selectorValue) {
        quantity = Number(selectorValue.value);
      } else {
        quantity = 1;
      }

      if (matchingItem) {
        matchingItem.quantity += quantity;
      } else {
        this.cart.push({
          productId,
          quantity,
          deliveryOptionId: "1", //default
        });
      }
      this.saveToStorage(); //since we are accesing it through the object
    },

    removeFromCart(productId) {
      const newCart = [];

      this.cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
          newCart.push(cartItem);
        }
      });
      this.cart = newCart;

      this.saveToStorage();
    },

    calculateCartQuantity(classSelector) {
      let cartQuantity = 0;
      this.cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
      document.querySelector(classSelector).innerText = `${cartQuantity}`;
    },

    updateQuantity(productId, newQuantity) {
      this.cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.quantity = newQuantity;
          if (newQuantity >= 0 && newQuantity < 1000) {
            const container = document.querySelector(
              `.js-cart-item-container-${productId}`
            );
            container.classList.remove("is-editing-quantity");
            document.querySelector(`.js-update-link-${productId}`).innerText =
              "Update";
            document.querySelector(
              `.js-quantity-label-${productId}`
            ).innerHTML = `${cartItem.quantity}`;
          } else {
            alert("Enter a positive value under 1000");
          }
          renderCheckouHeader();
          this.saveToStorage();
        }
      });
    },

    updateDeliveryOption(productId, deliveryoptionid) {
      let matchingItem;
      this.cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
      matchingItem.deliveryOptionId = deliveryoptionid;
      this.saveToStorage();
    },
  };
  return cartObject;
}

const cart = Cart('cart-oop');
const buisnessCart = Cart('cart-buisness');
//now they will load from differrent key and have different data
cart.loadFromStorage();
buisnessCart.loadFromStorage();

//but both the cart are been loaded from same localstorage key, so we will add a parametere

cart.addToCart("b0f17cc5-8b40-4ca5-9142-b61fe3d98c85");
console.log(cart);
console.log(buisnessCart);


// cartObject.loadFromStorage();
// cartObject.addToCart("b0f17cc5-8b40-4ca5-9142-b61fe3d98c85");
// console.log(cartObject);

//another reason to create oops is that we create multiple objects
//foreg. let say amazon have to sites main and business one , so there would be two different cart so for that we can copy the object to make two cart with similar properties using OOPs
// 1.By just copying the object then renaming the object-but this requires a lot of copy-pasting
//2.Generation by function - this is the best method
