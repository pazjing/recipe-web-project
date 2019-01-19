
export default class Likes {
    constructor() {
        this.likes = []
    }

    addLike(id, title, image, publisher) {
        const like = {
            id, 
            title,
            image,
            publisher
        }
        this.likes.push(like);
        this.setLocalStorage();
        return like;
    }

    deleteLike(id) {
        if(id) {
            const index = this.likes.findIndex(el => el.id === id);
            this.likes.splice(index,1);
            this.setLocalStorage();
        }
    }

    isLiked(id) {
        if(id) {
            const index = this.likes.findIndex(el => el.id === id);
            return !(index === -1);
        }
    }

    getNumLikes() {
        return this.likes.length;
    }

    setLocalStorage() {
        localStorage.setItem('like', JSON.stringify(this.likes));
    }

    getLocalStorage() {
       const storage = JSON.parse(localStorage.getItem('like'));
       if(storage) this.likes = storage;
    }
}