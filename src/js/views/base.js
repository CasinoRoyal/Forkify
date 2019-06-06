export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchList: document.querySelector('.results__list'),
  searchRes: document.querySelector('.results'),
  searchPagination: document.querySelector('.results__pages'),
  recipeTemplate: document.querySelector('.recipe'),
  shoppingList: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList:document.querySelector('.likes__list')
}

const elementsString = {
  loader: 'loader'
}

export function insertLoader(parent) {
  const loader = `
    <div class="${elementsString.loader}">
      <svg>
        <use xlink:href="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
}

export function deleteLoader() {
  const loader = document.querySelector(`.${elementsString.loader}`);

  if(loader) loader.parentElement.removeChild(loader);
}