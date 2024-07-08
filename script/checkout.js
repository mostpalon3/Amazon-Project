import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { renderCheckouHeader } from "./checkout/checkoutHeader.js";
import "../data/cart-oop.js"; //this is another syntax we can use for imports , this just runs all the file as we are not importing anything specific
// import "../data/cart-class.js";
// import '../data/backend-practice.js';
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage() {
  //error handling in async await
  try {
    //throw 'error1' ;//throws a error to catch later, error1 will be saved inside the error parameter
    //async wraps the code into promise and return promise
    console.log("load page");
    //await should be used directly under async , it cant be nested under other non-async function which is nested inside async function as it is not directly under main async function
    /*
  await loadProductsFetch(); //it lets us write async code as normal code , now it will wait for this function to complete, now we dont need to nest it in then and return this promise 
  //await can be used inside async only
  //async await can only be used with promise, but not with call backs
   const value = await new Promise((resolve) => {
    loadCart(() => {
      resolve('value3'); //resolve waits for each steps to finish before going to the next step
    });//here the value3 is returned if we used await for a promise, which we can save in variable 
    
    //await will wait for the resolve in promise that will run inside the loadcart as callback to be called to move forward
})
*/
    // we can use await on promise.all as well
    await Promise.all([
      loadProductsFetch(),
      new Promise((resolve, reject) => {
        //manually throw error in promise,2 ways
        //throw 'error2';//this promise is in await so instead of going inside .catch it will go in catch
        //throw is used for synchronous code 
        loadCart(() => {
          //here the code runs in future so throw wont work here
          //the 2nd parameter reject let us throw error in future
          // reject("error4");//reject is used for asynchronous code ,which runs in future
          resolve();
        });
      }),
    ]);
  } catch (error) {
    //try ends here , we put it in the try for the code which can cause error, as it handles the backend request in loadproductfetch
    //catch works like .catch in promises
    console.log("Unexpected error. Please try again later.");
    console.log(error);
  }

  //   console.log(value); //here the resolve ka value3 will be returned as variable

  renderCheckouHeader();
  renderOrderSummary();
  renderPaymentSummary();
  //now it is lot cleaner now there is no need to nest in then
  return "value2"; //it gets converted in resolve('value2')
}
loadPage().then((value) => {
  //that value2 will be saved in the value parameter
  console.log("Next Step");
  console.log(value);
});

//this is shortcut for this code
//    return new Promise((resolve) => {
//resolve();}

//Promise.all()-lets us run multiple promise at the same time
//and wait for all of them to finish

//it creates a array of promise
//all the promise gonna run at the same time

/*
Promise.all([
  // new Promise((resolve) => {
  //     loadProducts(() => {
  //         resolve('value1');//first loadproducts will finish then resolve will run to go to
  //     });
  // }),
  loadProductsFetch(), //this will return the promise , now we dont need to use resolve for it
  //it makes are code cleaner

  new Promise((resolve) => {
    loadCart(() => {
      resolve(); //resolve waits for each steps to finish before going to the next step
    });
  }),
]).then((values) => {
  console.log(values); //its gonna give u arrays of values,and undefined for no value given inside the promise resolve
  renderCheckouHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
//promise is a built-in class, we will crate new promise object
new Promise((resolve) => {
    //resolve is a function similar to done() function , kets us control when to go to the next step 
    //its going to run the function immediately 
    console.log('start promise');
    loadProducts(() => {
        console.log('finished loading');
        resolve('value1');//first loadproducts will finish then resolve will run to go to next step 
        //but the next step is not the code that is written after this code, actually promise create seperate thread of the code .so this code and the code written below are runnimg at the same time , promises are designed this to allow JS to do multiple things at the same time 
        //hence the next step of it is seperate from the rest of the code 
    });
    //we can give resolve a value for the parameter of next step
}).then((value) => {
    console.log('first step');
    console.log(value);
    return new Promise((resolve) => {
        console.log('second step');
        loadCart(() => {
            resolve();//resolve waits for each steps to finish before going to the next step
        });
    });

}).then(() => {
    console.log('last step');
    renderCheckouHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/

//callback method
/*
loadProducts(() => {
    loadCart(() => {
        renderCheckouHeader();
        renderOrderSummary();
        //moved all the code in two seperate folder to make it cleaner , and we need to call this function here since the checkout.html is running this file 
        renderPaymentSummary();
    });
});
*/
//if we have lots of callback it will cause more and more nesting and push the indentation(space before)
//the promises flattens the code,but have more lines of code , but avoides nesting , so it is recommended to use it

//why use promises over callbacks ?
//multiple callbacks cause a lot of nesting -means code inside the code
//eg in cart.js
//above ^
