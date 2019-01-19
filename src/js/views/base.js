export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchButton: document.querySelector('.search__btn'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipeDetail: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likeRecipe: document.querySelector('.recipe__love'),
    likeMenu: document.querySelector('.likes__field'),
    likeList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
};

export const renderLoader = parent => {
    const loaderMarkup = `
        <div class="loader">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loaderMarkup);
};

export const clearLoader = parent => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) {
        parent.removeChild(loader);
    }
};