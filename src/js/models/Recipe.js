import axios from 'axios';
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.image = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.publisher = res.data.recipe.publisher;
            this.title = res.data.recipe.title;
            this.source = res.data.recipe.source_url;
        } catch(error) {
            console.log(error);
        }
    }

    calcTime() {  
        // Assume each 3 ingredients need 15 mins
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
    }

    calcServings() {
        this.servings = 4;
    }
    
    // 47051, 46922, 47011
    parseIngredients() {

        const temp =[];

        this.ingredients.forEach((el,index) => {
            if (el.match(/[a-zA-Z]/g))
                temp.push(el);
        });

        const unitsLong = ['tablespoons', 'tablespoon', 'cups', 'teaspoons', 'teaspoon', 'pounds', 'ounces', 'ounce', 'pieces'];
        const unitsShort = ['tbsp', 'tbsp', 'cup', 'tsp', 'tsp', 'pound', 'oz', 'oz', 'piece'];
        const units = [...unitsShort, 'g','kg'];

        const newIngredients = temp.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });
            
            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g,' ');

            // 3. Parse ingredients into count, unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                // This is a unit
                // Ex. 4 cups, arrCount is [4]
                // Ex. 4-1/2 cups, eval("4+1/2") --> 4.5
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else{
                    const newArrCount = [];
                    arrCount.forEach((el,i) => {  // 1 large slice pound cake
                        if(!isNaN(el)) newArrCount.push(el);
                    });
                    count = eval(newArrCount.join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
            } else if(parseInt(arrIng[0], 10)) {
                // This is no unit, but the 1st position is a number
                // Ex. 4 stick butter, arrCount is [4]
                // Ex. 4-1/2 stick butter, eval("4+1/2") --> 4.5
                // Ex. 4 1/2 stick butter, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                let arrCount =[];
                let count;
                if (parseInt(arrIng[1], 10)) {
                    count = eval(arrIng.slice(0,2).join('+'));
                    arrCount = arrIng.slice(2);
                } else {
                    count = eval(arrIng[0].replace('-', '+'));
                    arrCount = arrIng.slice(1);
                }
                objIng = {
                    count,
                    unit: '',
                    ingredient: arrCount.join(' '),
                };
            } else if(unitIndex === -1) {
                // This is no unit and no number in the 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
            return objIng;
        });

        this.ingredients = newIngredients;
    }

    upateServings (type) {
        // Servings
        const newServings = type === 'dec'? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        });

        this.servings = newServings;
    }
}