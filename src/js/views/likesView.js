import { elements } from './base';
import { getTitleLimit } from './searchView';
 
export function toggleLikesBtn(isLiked) {
  const iconHeart = isLiked ? 'icon-heart' : 'icon-heart-outlined';

  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconHeart}`);

}

export function toggleLikesMenu(numLikes) {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export function renderLikes(like) {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
        <figure class="likes__fig">
          <img src="${like.img}" alt="${like.title}">
        </figure>
        <div class="likes__data">
          <h4 class="likes__name">${getTitleLimit(like.title)}</h4>
          <p class="likes__author">${like.publisher}</p>
        </div>
      </a>
    </li>    
  `;

  elements.likesList.insertAdjacentHTML('beforeend', markup);
}

export function deleteLike(id) {
  const elem = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  if (elem) elem.parentElement.removeChild(elem);
}