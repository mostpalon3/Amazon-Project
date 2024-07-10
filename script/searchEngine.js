import { loadProductsFetch, products } from "../data/products.js";


export let searchedProduct;
export function searchButtonAction() {
    const searchButtonDOM = document.querySelector('.js-search-button');
    searchButtonDOM
        .addEventListener('click', () => {
            const searchBarValue = document.querySelector('.js-search-bar').value;
            window.location.href = `index.html?search=${searchBarValue}`
        });
}

export async function searchingProduct() {
    const url = new URL(window.location.href)
    const searchKeyword = url.searchParams.get('search');
    console.log(searchKeyword);
    await loadProductsFetch();
    if (searchKeyword) {
        const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
        searchedProduct = products.filter((product) => {
            const lowerCaseProduct = product.name.toLowerCase();
            if ( lowerCaseProduct.includes(lowerCaseSearchKeyword) ) {
                return true;
            }
            for(const key of product.keywords){
                const lowerCaseProductKeyword = key.toLowerCase();
                if ( lowerCaseProductKeyword.includes(lowerCaseSearchKeyword) ) {
                    return true;
                }
            }
            return false;
            });
        }
        return searchedProduct;
    }
