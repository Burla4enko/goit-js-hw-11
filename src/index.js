import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import photoCardMarkup from './templates/photo-card.hbs';
import { getFetchImg } from './js/getFetchImg';
import debounce from 'lodash.debounce';

const refs = {
  form: document.querySelector('#search-form'),
  searchInput: document.querySelector('.search-form__input'),
  loadMoreBtn: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-form__btn'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onSubmit);
refs.searchInput.addEventListener('input', debounce(onInput, 300));
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let query = '';
let lightbox = null;
let page = 1;
const perPage = 40;

function onInput() {
  if (this.value.trim()) {
    refs.searchBtn.disabled = false;
  } else {
    refs.searchBtn.disabled = true;
  }
}

async function onSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements.searchQuery.value;
  resetRequest();
  refs.searchBtn.disabled = true;
  try {
    const getFetchImgResponse = await getFetchImg(query, page, perPage);
    const picturesArray = await getFetchImgResponse.hits;

    if (!picturesArray.length) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    createMarkup(picturesArray);

    lightbox = new SimpleLightbox('.gallery a', {
      captionDelay: 250,
    });

    Notiflix.Notify.success(
      `Hooray! We found ${getFetchImgResponse.totalHits} images.`
    );

    if (getFetchImgResponse.totalHits > perPage) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    Notify.failure(`Something is wrong. ${error.message}`);
  }
}

function createMarkup(picturesArray) {
  const markup = photoCardMarkup(picturesArray);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function resetRequest() {
  refs.gallery.innerHTML = '';
  refs.searchInput.value = '';
  page = 1;
  refs.loadMoreBtn.classList.add('is-hidden');
}

async function onLoadMore() {
  try {
    page += 1;
    const getFetchImgResponse = await getFetchImg(query, page, perPage);
    const picturesArray = await getFetchImgResponse.hits;
    createMarkup(picturesArray);
    lightbox.refresh();

    const рages = Math.ceil(getFetchImgResponse.totalHits / perPage);

    if (page === рages) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}
