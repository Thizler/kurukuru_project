const ArrayList = require('./ArrayList');

let favoriteVideos = new ArrayList();

class FavoriteModel {
    static getFavorites() {
        return favoriteVideos.getAll();
    }

    static addFavorite(video) {
        if (!favoriteVideos.getAll().some((fav) => fav.video_id === video.video_id)) {
            favoriteVideos.add(video);
        }
    }

    static removeFavorite(videoId) {
        const index = favoriteVideos.getAll().findIndex((fav) => fav.video_id === videoId);
        if (index !== -1) {
            favoriteVideos.remove(index);
        }
    }
}

module.exports = FavoriteModel;