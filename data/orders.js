export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order){
    //we want the recent order at top
    orders.unshift(order);//this will add the order in front  instead of back, when we give the function any order to add
    saveToStorage();
    console.log(orders);//or see by in console localStorage.getItem('orders
}

function saveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders));
}