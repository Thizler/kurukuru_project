const fs = require('fs');
const path = require('path');
const ArrayList = require('./ArrayList'); // import ArrayList

const dataFilePath = path.join(__dirname, '../data/kurukuru.json');

class VideoModel {
    static getVideos() {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        const videoTable = data.find((table) => table.name === 'videos');
        const videos = new ArrayList();

        if (videoTable?.data) {
            videoTable.data.forEach(video => videos.add(video));
        }

        return videos;
    }

    static getSubcategories() {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
        const subcatTable = data.find((table) => table.name === 'subcategory');
        const subcategories = new ArrayList();

        if (subcatTable?.data) {
            subcatTable.data.forEach(sub => subcategories.add(sub));
        }

        return subcategories;
    }
}

module.exports = VideoModel;
