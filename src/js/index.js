import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, insertLoader, deleteLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

const state = {};

/**
* SEARCH CONTROLLER
*/

async function controlSearch() {
  const query = searchView.getInput();

  if(query) {
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResult();

    insertLoader(elements.searchRes);

    try{ 
      await state.search.getResult();

      deleteLoader();

      searchView.getRecipes(state.search.result);
    } catch(err) {
      throw new Error(err);
      deleteLoader();
    }
  }

};

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();

  controlSearch();
});

elements.searchPagination.addEventListener('click', (e) => {

  let btn = null;
  // closest-polyfill for ie

  if (!Element.prototype.closest) {

    Element.prototype.closest = function(css) {
      const node = this;

      while (node) {
        if (node.matches('.btn-inline')) btn = node;
        else node = node.parentElement;
      }
      return null;
    };
  } else {

    btn = e.target.closest('.btn-inline'); 

    if(btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);

      searchView.clearResult();

      searchView.getRecipes(state.search.result, goToPage);
    }

  }
});

/**
* RECIPE CONTROLLER
*/

async function controlRecipe() {
  const id = window.location.hash.replace('#', '');

  if (id) {
    recipeView.clearRecipe();
    insertLoader(elements.recipeTemplate);

    if (state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();

      state.recipe.parseIngredients();

      state.recipe.calcTime();
      state.recipe.calcServings();

      deleteLoader();

      recipeView.renderRecipe(
        state.recipe, 
        state.likes.isLiked(id)
        );

    } catch(err) {
        throw new Error(err)
    }
  }

}

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

/**
* LIST CONTROLLER
*/

function controlList() {

  if (!state.list) state.list = new List();

  state.recipe.ingredients.forEach((ing) => {
    const item = state.list.addItem(ing.count, ing.unit, ing.ingredient);
    listView.renderItem(item);
  })

}

elements.shoppingList.addEventListener('click',(e) => {
  
  let elem = null;
  // closest-polyfill for ie

  if (!Element.prototype.closest) {

    Element.prototype.closest = function(css) {
      const node = this;

      while (node) {
        if (node.matches('.shopping__item')) elem = node;
        else elem = node.parentElement;
      }
      return null;
    };
  } else {
      elem = e.target.closest('.shopping__item');
  }

  const id = elem.dataset.itemid;

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    
    const val = parseFloat(e.target.value, 10);

    state.list.updateItem(id, val);
  }

  
});

/**
* LIKE CONTROLLER
*/

function controlLike() {

  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    const newLike = state.likes.addLike(
      currentID, 
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.img,
      );

    likesView.toggleLikesBtn(true);

    likesView.renderLikes(newLike);
  } else {
    state.likes.deleteLike(currentID);
    
    likesView.toggleLikesBtn(false);

    likesView.deleteLike(currentID);
  }

  likesView.toggleLikesMenu(state.likes.getNumLikes());
}

window.addEventListener('load', () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikesMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLikes(like))
});

elements.recipeTemplate.addEventListener('click', (e) => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }

  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      controlLike();
  }
});

