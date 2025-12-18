const VideoModel = require('../models/VideoModel');

exports.renderTrending = (req, res) => {
    const sortOrder = req.query.sort || 'high';
    const subcategories = VideoModel.getSubcategories();
    const videos = VideoModel.getVideos();
    console.log(VideoModel.getSubcategories());
    console.log(videos);
    const trendingData = subcategories.items.map((subcategory) => ({
        subcategory_name: subcategory.subcategory_name,
        priority: subcategory.priority,
        
        videos: videos.items.filter((video) => video.subcategory_id === subcategory.subcategory_id),
        
    }));

    if (sortOrder === 'high') {
        trendingData.sort((a, b) => b.priority - a.priority);
    } else if (sortOrder === 'low') {
        trendingData.sort((a, b) => a.priority - b.priority);
    }

    res.render('trending', { trendingData, sortOrder, user: req.session.user });
};