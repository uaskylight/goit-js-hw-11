const axios = require('axios').default;

const BASIC_URL = 'https://pixabay.com/api/';
const API_KEY = '17678291-8f52cafe3b96aa295b9f12444';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.page = 1;
    this.perPage = 40;
    this.displayAmount = this.perPage;
    this.myTotalHits = 0;
  }

  async fetchArticles() {
    const url = `${BASIC_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.perPage}`;

    try {
      // USING AXIOUS

      const response = await axios.get(url);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get getQuery() {
    return this.searchQuery;
  }

  set setQuery(newQuery) {
    this.searchQuery = newQuery;
  }
}
