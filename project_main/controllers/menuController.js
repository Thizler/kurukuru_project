const fs = require('fs');
const path = require('path');

// Load kurukuru.json data
let kurukuruData;
try {
    kurukuruData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/kurukuru.json'), 'utf-8'));
} catch (error) {
    console.error('❌ Error loading JSON data:', error);
    kurukuruData = [];
}

// Render menu page with categories
exports.renderMenu = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const categories = kurukuruData.find((table) => table.name === 'maincategory')?.data || [];
    const subcategories = kurukuruData.find((table) => table.name === 'subcategory')?.data || [];
    const videos = kurukuruData.find((table) => table.name === 'videos')?.data || [];

    // รับค่าหมวดหมู่ย่อยที่เลือกจากฟอร์ม
    const selectedSubcategories = req.body.subcategory || [];
    let filteredVideos = videos;

    if (selectedSubcategories.length > 0) {
        // กรองวิดีโอที่ตรงกับหมวดหมู่ย่อยที่เลือก
        filteredVideos = videos.filter((video) =>
            selectedSubcategories.includes(video.subcategory_id)
        );
    }

    res.render('menu', {
        user: req.session.user,
        categories,
        subcategories,
        videos: filteredVideos, // ส่งวิดีโอที่กรองแล้วไปยัง view
        selectedSubcategories // ส่งหมวดหมู่ย่อยที่เลือกไปยัง view
    });
};

// Render settings page
exports.renderSetting = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('setting', { user: req.session.user });
};

