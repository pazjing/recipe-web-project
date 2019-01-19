import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const elementList = document.querySelectorAll('.results__link');
    Array.from(elementList).forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > 17) {
        title.split(' ').reduce((acc, cur) => {
            if((acc + cur.length) <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(" ")}...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createPageButton = (type, currPage) => {
    const buttonMarkup = `
        <button class="btn-inline results__btn--${type}" data-goto="${type === 'next'? (currPage + 1) : (currPage -1)}">
            <span>Page ${type === 'next'? (currPage + 1) : (currPage -1)}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'next'? 'right' : 'left'}"></use>
            </svg>        
        </button>
    `;
    return buttonMarkup;
};

const renderPageButton = (currPage, totalRecipes, recipePerPage = 10) => {
    const pages = Math.ceil(totalRecipes / recipePerPage); 
    let buttonMarkup;

    if(currPage === 1 && pages > 1) {
        // Only show Next page button
        buttonMarkup = createPageButton('next', currPage);

    } else if (currPage > 1 && pages > currPage) {
        // Show Prev page and Next page buttons
        buttonMarkup = `
            ${createPageButton('next', currPage)}
            ${createPageButton('prev', currPage)}
        `;
    } else if(currPage === pages && pages > 1) {
        // Only show Prev page
        buttonMarkup = createPageButton('prev', currPage);
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', buttonMarkup);
};

export const renderResults = (recipes, currPage = 1, recipePerPage = 10) => {
    const start = (currPage - 1) * recipePerPage;
    const end = start + recipePerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    renderPageButton(currPage, recipes.length);
};