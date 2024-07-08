import {addToCart, cart, loadFromStorage} from '../../../data/cart.js';

describe('test suite: addToCart', () => {
    it('adds a new product to the cart', () => {   
        //spyOn() records every time a method is used
        //this is also called mocking a method 
        //addToCart also have saveToStorage() function which can save the fake function from below so we even need to fake the setItem  
        //order of the code matter so setItem will come first 
        spyOn(localStorage, 'setItem');//mockingn setItem - replaced by fake version
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([]);
        });//here the string is the method we want to mark and that we replace getItem with the fake version
        console.log(localStorage.getItem('cart'));
        loadFromStorage();//reloads the cart after making a fake version od the cart

        addToCart('54e0eccd-8f36-462b-b68a-8182611d9add');
        expect(cart.length).toEqual(1);
        //to check a method for no. of times it has been called , and this method only works for spyOn
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('54e0eccd-8f36-462b-b68a-8182611d9add');
        expect(cart[0].quantity).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledWith('cart', '[{"productId":"54e0eccd-8f36-462b-b68a-8182611d9add","quantity":1,"deliveryOptionId":"1"}]');//it checks if the code called localstorage.setitems('cart' , '[]') at some point
    });
    //flaky test = test that sometimes passes and sometimes fails 
    //so we will create mock
    
    it('adds an existing product to the cart', () => {
        //a mock only lasts for 1 test 
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: '54e0eccd-8f36-462b-b68a-8182611d9add',
                quantity: 2,
                deliveryOptionId : 1
            }]);
        });
        loadFromStorage();//reloading the cart
        console.log(cart);

        addToCart('54e0eccd-8f36-462b-b68a-8182611d9add');
        expect(cart.length).toEqual(1);
        expect(localStorage.setItem).toHaveBeenCalledTimes(1);
        expect(cart[0].productId).toEqual('54e0eccd-8f36-462b-b68a-8182611d9add');
        expect(cart[0].quantity).toEqual(3);
    });

});
// unit test = test 1 code 
//integration test = tests many units /pieces of coded together