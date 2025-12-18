const FavoriteModel = require('../models/FavoriteModel');

exports.addToFavorite = (req, res) => {
    const video = req.body.video;
    FavoriteModel.addFavorite(video); // 
    console.log(FavoriteModel.addFavorite(video));
    res.status(200).json({ success: true, message: 'Video added to favorites' });
};

exports.renderFavorites = (req, res) => {
    const searchQuery = req.query.search || '';
    let favorites = FavoriteModel.getFavorites();
    console.log('favorites',favorites); // Debugging line

    if (searchQuery) {
        favorites = favorites.filter((video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    res.render('favorite', { favorites, user: req.session.user, searchQuery });
};