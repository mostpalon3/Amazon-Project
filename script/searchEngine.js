import { loadProductsFetch, products } from "../data/products.js";
import { renderProductsGrid } from "./amazon.js";

export let searchedProduct;
export function searchButtonAction() {
  const searchButtonDOM = document.querySelector('.js-search-button');
  searchButtonDOM
    .addEventListener('click', () => {
      const searchBarValue = document.querySelector('.js-search-bar').value;
      window.location.href = `index.html?search=${searchBarValue}`
    });
}

export function searchingProduct() {
  const url = new URL(window.location.href)
  const searchKeyword = url.searchParams.get('search');
  console.log(searchKeyword);
  if (searchKeyword) {
    searchedProduct = products.filter((product) => {
      if (product.name.includes(searchKeyword)) {
        return product;
      }
    });
    console.log(searchedProduct);
    loadProductsFetch();
    console.log(products);
  }
}