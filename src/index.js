import getImages from './js/fetchData.js';
import NewsApiService from './js/fetchData';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
var throttle = require('lodash.throttle');
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

// Handelbars templates
import articleTpl from './templates/image.hbs';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const newsApiService = new NewsApiService();

// Prevent default behavior of the form
form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

let lightbox = new SimpleLightbox('.gallery a', {
  /* options */
  captionDelay: 300,
});

async function onSearch(e) {
  e.preventDefault();

  newsApiService.resetPage();
  clearArticlesContainer();
  let userRequest = e.currentTarget.elements.searchQuery.value.trim();
  loadMoreBtn.classList.add('is-hidden');

  if (!userRequest) {
    Notify.failure('Please provide search data!');
    return;
  }

  newsApiService.searchQuery = userRequest;

  try {
    const fetchedData = await newsApiService.fetchArticles();

    const { hits: articles, totalHits } = fetchedData;

    // Check if we received data in request
    if (articles.length === 0) {
      console.log(articles.length);
      loadMoreBtn.classList.add('is-hidden');

      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    // Show success message
    Notify.success(`Horray! We found ${totalHits} images.`);
    // Use displayAmount to calculate how much pictures will display
    newsApiService.displayAmount = newsApiService.perPage;
    // Value how much matches query get
    newsApiService.myTotalHits = totalHits;
    // Append html markup to the page
    appendArticlesMarkup(articles);
    // refresh lightbox
    lightbox.refresh();
    // Show 'load more' button
    loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    console.log(error.message);
  }
}

async function onLoadMore() {
  if (newsApiService.displayAmount >= newsApiService.myTotalHits) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.classList.add('is-hidden');
    return;
  }
  // Update quantity how much pictures has already displayed
  newsApiService.displayAmount += newsApiService.perPage;

  try {
    const fetchedData = await newsApiService.fetchArticles();
    const { hits: articles } = fetchedData;
    appendArticlesMarkup(articles);
    lightbox.refresh();

    // Smooth scrolling
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error.message);
  }
}

function appendArticlesMarkup(articles) {
  galleryEl.insertAdjacentHTML('beforeend', articleTpl(articles));
}

function clearArticlesContainer() {
  galleryEl.innerHTML = '';
}
