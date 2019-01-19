import uniqid from 'uniqid';

export default class ShoppingList {
    constructor() {
        this.items = []
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        if(id) {
            const index = this.items.findIndex(el => el.id === id);
            if(index > -1) {
                this.items.splice(index,1);
            }
        }
    }

    updateCount(id, newCount) {
        if(id) {
            this.items.find(el => el.id === id).count = newCount;
        }
        const index = this.items.findIndex(el => el.id === id);
    }
}