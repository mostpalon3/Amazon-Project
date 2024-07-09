import { renderCheckouHeader } from "../script/checkout/checkoutHeader.js";
export let cart;
export let cartTemp = [];
const url = new URL(window.location.href);
export let para = url.searchParams.get('para');
//the page will render according to url
renderCart(para);
export function renderCart(para) {
    if (para) {
        loadFromStorage('cartTemp');
    } else {
        loadFromStorage('cart');
    }

    function loadFromStorage(cartKey) {
        cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    }
}
export function buyNow(productId) {
    let selectorValue = document.querySelector(`.js-quantity-selector-${productId}`);
    let quantity = Number(selectorValue.value);
    cartTemp.push({
        productId,
        quantity,
        deliveryOptionId: '1'//default
    });
    //saved in cartTemp localstorage
    saveToStorage(true);
}

export function saveToStorage(para) {
    if (para) {
        localStorage.setItem(`cartTemp`, JSON.stringify(cartTemp));
    } else {
        localStorage.setItem(`cart`, JSON.stringify(cart));
    }
}

export function addToCart(productId) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    let selectorValue = document.querySelector(`.js-quantity-selector-${productId}`);
    let quantity;
    if (selectorValue) {
        quantity = Number(selectorValue.value);
    } else {
        quantity = 1;
    }

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            deliveryOptionId: '1'//default
        });
    }
    saveToStorage(false);
}
//steps to remove from cart 
//1.create a new array 
// loop through the cart 
//3. Add each product to the new array , except for this productId
export function removeFromCart(productId,para) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;//assing the cart to new cart, or u can say that it is one of the way to update the new value of the cart  

    saveToStorage(para);
}
//steps to remove the product from the page 
//1. Use the DOM to get the element to remove (so we will give the unique class by adding the id to the class od the container of that product )
//2. Use .remove() method

export function calculateCartQuantity(classSelector) {
    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    document.querySelector(classSelector)
        .innerText = `${cartQuantity}`;
}

export function updateQuantity(productId, newQuantity,para) {
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            cartItem.quantity = newQuantity;
            if (newQuantity >= 0 && newQuantity < 1000) {
                const container = document.querySelector(`.js-cart-item-container-${productId}`)
                container.classList.remove('is-editing-quantity');
                document.querySelector(`.js-update-link-${productId}`)
                    .innerText = 'Update';//so that the input dissapear only after the correct value is entered
                document.querySelector(`.js-quantity-label-${productId}`)
                    .innerHTML = `${cartItem.quantity}`;
            } else {
                alert('Enter a positive value under 1000');
            }
            //   calculateCartQuantity('.js-checkout')
            renderCheckouHeader();
            saveToStorage(para);
        }
    })
}

//After updating the date in the cart at the top of the product in checkou page , we need to fix the radio check button to make it update the date on changing the selection
//1.Update deliveryOptionId in the cart 
//2.Update the page 

//1.Loop through the cart and find the product 
//2.Update the deliveryOptionId of the product 

//dekho meri bhasa me , jab bhi ham ek radio selector par click karenge to usmme se hame product kee id milegi aur delivery option ka id milega,jaise hamne pehle product me se ek specific item dhunda tha tb hame matchingProduct mila tha waise hee cart me se hame matchingItem dhundna hai taki ham deliveryoptionid mil sake matchingproductid k sahare
//yha se deliveryOptionId update ho jayegi jo v option choose krenge fir usi hisab se header date wle option me code run hoga to wo id access krega option wli aur date v uupdate krdega

export function updateDeliveryOption(productId, deliveryoptionid) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    })
    matchingItem.deliveryOptionId = deliveryoptionid;
    saveToStorage(false);
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        console.log(xhr.response);
        fun();
    })

    xhr.open('GET', 'https://supersimplebackend.dev/cart');//here we are just practicing so it will just give text 
    xhr.send();
}