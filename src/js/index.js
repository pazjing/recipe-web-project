
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import ShoppingList from './models/ShoppingList';
import * as shoppingListView from './views/shoppingListView';
import Likes from './models/Likes';
import * as likeView from './views/likesView';

/** Global state of the app 
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Like object
 */
const state = {
    added: false
};

/************************************
 *  SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();
    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        try{
            // 4. Search for recipes
            await state.search.getResults();

            // 5. Render results on UI
            clearLoader(elements.searchResult);
            searchView.renderResults(state.search.result);
        } catch(error) {
            alert(`Error in search control. ${error}`);
        }
    }
};

elements.searchButton.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');
    if(button) {
        const goToPage = parseInt(button.dataset.goto);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/************************************
 *  RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    state.added = false;
 
    if(id) {
        // 1. Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipeDetail);
        if (state.search) {
             searchView.highlightSelected(id);
        }

        // 2. Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // 3. Get recipe data async
            await state.recipe.getRecipe();

            // 4. Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
            state.recipe.parseIngredients();

            // 5. Render recipe
            clearLoader(elements.recipeDetail);
            recipeView.renderRecipeDetail(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            alert(`Error in recipe control. ${error}`);
        }
    }
};

['load', 'hashchange'].forEach( e => window.addEventListener(e, controlRecipe));


elements.recipeDetail.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            state.recipe.upateServings('dec');
            recipeView.updateServings(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.upateServings('inc');
        recipeView.updateServings(state.recipe);
    } else if(e.target.matches('.btn-add-to-list, .btn-add-to-list *')) {
        controlShoppingList();
        state.added = true;
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();

    }
});

/************************************
 *  SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
    if(!state.shoppingList) state.shoppingList = new ShoppingList();

    if(!state.added) {
        // create the itemLists
        state.recipe.ingredients.forEach(el => {
            state.shoppingList.addItem(el.count, el.unit, el.ingredient);
        });

        // Display on the UI
        shoppingListView.clearShoppingList();
        state.shoppingList.items.forEach(shoppingListView.renderItem);
    }
};

elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.shoppingList.deleteItem(id);
        shoppingListView.deleteItem(id);

    } else if (e.target.matches('.shopping__count, .shopping__count *')) {
        
        const newCount = parseFloat(e.target.value);
        state.shoppingList.updateCount(id, newCount);

    }
});

/************************************
 *  LIKES CONTROLLER
 */
const controlLike = () => {
    const id = state.recipe.id;

    if(!state.likes) state.likes = new Likes();

    // This recipe HAS like
    if(state.likes.isLiked(id)) { 
        // Toggle the recipe like button to NOT liked
        likeView.toggleLikeBtn(false);

        // Remove recipe from state.likes
        state.likes.deleteLike(state.recipe.id);
        // Delete recipe to like UI 
        likeView.removeLike(state.recipe.id);
        
    // This recipe has NOT like
    } else {  
        // Toggle the recipe like button to liked
        likeView.toggleLikeBtn(true);

        // Add recipe into state.likes
        const currLike = state.likes.addLike(
            state.recipe.id,
            state.recipe.title,
            state.recipe.image,
            state.recipe.publisher
        );
        // Add recipe to like UI
        likeView.renderLike(currLike);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes() > 0);


}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.getLocalStorage();

    likeView.toggleLikeMenu(state.likes.getNumLikes() > 0);

    state.likes.likes.forEach(likeView.renderLike);
});