import { apiService } from '../services/ApiService';

import Store from './Store';

export default class ProductsStore extends Store {
  constructor() {
    super();

    this.products = [];

    this.totalPageCount = 0;
    this.currentPage = 1;

    this.keyword = '';
    this.categoryId = 0;
  }

  async fetchProducts(page) {
    const { products, totalPageCount } = await apiService
      .fetchProducts({ page, keyword: this.keyword, categoryId: this.categoryId });

    this.products = products;
    this.totalPageCount = totalPageCount;
    this.publish();
  }

  reset() {
    this.keyword = '';
    this.categoryId = 0;
  }

  async changePage(page) {
    this.currentPage = page;

    await this.fetchProducts(page);
    this.publish();
  }

  async changeKeyword(keyword) {
    this.keyword = keyword;

    this.publish();
  }

  async changeCategoryId(categoryId) {
    this.categoryId = categoryId;

    this.publish();
  }
}

export const productsStore = new ProductsStore();
