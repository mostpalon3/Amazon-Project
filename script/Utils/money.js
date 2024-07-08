export function formatCurrency(priceCents){
    return (Math.round(priceCents)/100).toFixed(2);
}

export default formatCurrency;
//(now to import this anywhere else u just need not to use curly bracket )
//each file can have only one default export 
//this makes the code cleaner 