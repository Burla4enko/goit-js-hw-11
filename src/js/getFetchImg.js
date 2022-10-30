import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30913652-44dd132e2d5af231f1a716f92';

export async function getFetchImg(query, page, perPage) {
  const param = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}`;
  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&${param}&q=${query}&page=${page}`
  );
  return response.data;
}
