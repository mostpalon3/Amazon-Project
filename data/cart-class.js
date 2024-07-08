import { renderCheckouHeader } from "../script/checkout/checkoutHeader.js";

//Classes
//A way to generate objects
//it is cleaner and have more functions

//use PasaclCase for the things that genearate object
//classes have little bit different syntax than object, here instead : we use = and instead , we use ; and for method nothing
//class looks like the object it generates
class Cart {
  cart;//here we can remove undefined //public property-can be accessed anywhere 
  #localStorageKey ;//private property-can be accesed only inside this class

  //it works like normal method - we will put code inside and it will run the code but the special thing about it is we generate an object it will run the constructor automatically
  //it will setup the object
  constructor(localStorageKey) {
    //so whatever new object we generate this point to that object and then setup the object which was previously done outside 
    this.localStorageKey = localStorageKey;
    this.#loadFromStorage();
  }

  #loadFromStorage() {//private method
    this.cart = JSON.parse(localStorage.getItem(this.#localStorageKey)) || []; //here we are accesing localstoreagekey from the class
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cart));
  }

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
        deliveryOptionId: "1",
      });
    }
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];

    this.cart.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cart = newCart;

    this.saveToStorage();
  }

  calculateCartQuantity(classSelector) {
    let cartQuantity = 0;
    this.cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector(classSelector).innerText = `${cartQuantity}`;
  }

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
  }

  updateDeliveryOption(productId, deliveryoptionid) {
    let matchingItem;
    this.cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.deliveryOptionId = deliveryoptionid;
    this.saveToStorage();
  }
}

//we call the parameter of constructor through class
const cart = new Cart('cart-oop'); //this generates the new object using the class
const buisnessCart = new Cart('cart-buisness');

//we will run it inside the constructor
// cart.localStorageKey = 'cart-oop';
// buisnessCart.localStorageKey = 'cart-buisness';

// cart.loadFromStorage();
// buisnessCart.loadFromStorage();

cart.addToCart("b0f17cc5-8b40-4ca5-9142-b61fe3d98c85");
console.log(cart);
console.log(buisnessCart);

console.log(cart instanceof Cart); //this will show that it was generated from this class

//features of classes
//constructor = lets us run setup code ,lets us put this setup code inside the class
//the method has to be named constructor and it doesnt return anything

//Private properties and method 
//useful in bigger project where there is confusion about which key should not be changed outside the scope 
// for eg if we change the property of localstoragekey it will affect the above code and it will start saving to different key 

// cart.#localStorageKey = 'aaa'; //anybody can change the property like this if we are working in the team 
//so we can make it private by adding #in starting 
