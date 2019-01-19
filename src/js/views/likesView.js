import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeMenu = flag => {
    elements.likeMenu.style.visibility = flag ? "visible" : "hidden";
};

export const toggleLikeBtn = flag => {
    const iconString = `img/icons.svg#icon-heart${flag ? '' : '-outlined'}`;
    document.querySelector('.recipe__love use').setAttribute('href', iconString);
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.publisher}n</p>
                </div>
            </a>
        </li>
    `;
    elements.likeList.insertAdjacentHTML('beforeend', markup);

};

export const removeLike = id => {
    const element = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;
    element.parentElement.removeChild(element);
};


