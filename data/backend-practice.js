//XMLHttpRequest = This is a built-in class (provided by JavaScript)
const xhr = new XMLHttpRequest();//creates a new HTTP message to send to the backend 
//message= request 

//load means the response has loaded 
//we have written it before sending the request because we need to setup the request first ,then after we have to request (same as the eg. for a button click eventlistener)
xhr.addEventListener('load', () => {
    console.log(xhr.response);//now this will not return undefined , since it will run after being loaded 
});

//setup request
 xhr.open('GET', 'https://supersimplebackend.dev');//sets it up
//first parameter - get some info from backend -what type of HTTP message we want to send 
//Kinds of requests:
//GET,POST,PUT,DELETE
//second parameter - where to send HTTP message that is connected to internet 
//URL = Uniform Resource Locater
//-Like an address , but for the internet .
//-Helps us locate another computer on the internet .
//for eg. https://amazon.com - here it is using http to communicate with the computer , and s means it is using the secure version of http ,the right portion is the address that points to other computer 
// xhr.send();//sends across the internet to the backend computer 

//after inspect and in network section , we need to open it before sending the message, so after opening it we can refersh the page to re-send the message 

//backend recieves and responds
//Request-Response Cycle = 1 Request , 1 response
//get the response by:
//It takes time for the request to travel across the internet and for the response to come back
//response will undefined for a while, so we need to wait 
// xhr.response

//we can send different messages using URL Path , url/(file), or else url/
//Each URL path will give us different response 
xhr.open('GET', 'https://supersimplebackend.dev/hello');//Text-type response
//we will get different response now 
xhr.open('GET', 'https://supersimplebackend.dev/products/first');//JSON-type response,after this we can use JSON.parse() to convert into js object.This allows us to send JS objects across the internet , to the backend 
//A Backend only supports a certain set of URL paths 
//If we send a request toa URL path that is not supported, the backend will respond with an error 
//It is decided at the backend which URL is valid 

//NOTE: We are overwriting the URL request with latest request 
xhr.open('GET', 'https://supersimplebackend.dev/products/not-supported');//gave a errorMessage
//backend give a status code 
//Status code with 4 or 5 (400,404, 500) = failed 
//starting with 4 = it was our problem, 5= backend problem
//status code with 2 (200,201,204) = succeeded

//there is no way to know about all the url supported for security purpose , but some backends provide a doc page for all the URL supported , and that list is called BACKEND API,
// API =application programming interface 
//interface- how we interact with something 
//backend can react with different types of data 

xhr.open('GET', 'https://supersimplebackend.dev/documentation');//Text-HTML type response
xhr.open('GET', 'https://supersimplebackend.dev/images/apple.jpg');//image type response
//it will display in browser as it sends get request directly, in console it will only show the raw data
xhr.open('GET', 'https://supersimplebackend.dev');
xhr.send();