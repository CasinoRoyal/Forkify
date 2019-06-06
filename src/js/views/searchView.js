import { elements } from './base';

export function getTitleLimit(title, limit = 25) {
  const limitedTitle = [];

  if (title.length > limit) {

    title.split(' ').reduce((acc, cur) => {
      
      if (acc + cur.length <= limit) {
        limitedTitle.push(cur);
      }

      return acc + cur.length
    }, 0)

    return `${limitedTitle.join(' ')} ...`;
  }
  
  return title;
}

function renderRecipe(recipe) {
  const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${getTitleLimit(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
  `;
  elements.searchList.insertAdjacentHTML('beforeend', markup);
}

function createButton(page, type) {
  return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
      <span> Page ${type === 'prev' ? page - 1 : page + 1}</span>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
      </svg>
    </button>
  `;
}

function renderBtns(page, numResult, resPerPage) {
  const pages = Math.ceil(numResult / resPerPage);

  let button;

  if (page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `
      ${button = createButton(page, 'prev')}
      ${button = createButton(page, 'next')}
    `
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }

  elements.searchPagination.insertAdjacentHTML('afterbegin', button);
}

export function getInput() {
  return elements.searchInput.value;
}

export function clearInput() {
  elements.searchInput.value = '';
}

export function clearResult() {
  elements.searchList.innerHTML = '';
  elements.searchPagination.innerHTML = '';
}

export function getRecipes(recipes, page = 1, resPerPage = 10) {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe);

  renderBtns(page, recipes.length, resPerPage);
}

export function highlightSelected(id) {
  const linksArr = Array.from(document.querySelectorAll('.results__link'));
  linksArr.map((link) => {
    link.classList.remove('results__link--active');
  });

  document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}
