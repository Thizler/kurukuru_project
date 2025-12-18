const FavoriteModel = require('../models/FavoriteModel');

// ต้องย้าย list ออกมาอยู่นอก constructor เพื่อให้สามารถ reset ได้
let list = [];

jest.mock('../models/ArrayList', () => {
    return jest.fn().mockImplementation(() => {
        return {
            add: (item) => list.push(item),
            remove: (index) => list.splice(index, 1),
            getAll: () => list
        };
    });
});

describe('FavoriteModel Testcases', () => {
    beforeEach(() => {
        // reset list แบบตรง ๆ
        list.length = 0;
    });

    it('1. เรียก getFavorites ตอนยังไม่มี favorite', () => {
        const result = FavoriteModel.getFavorites();
        expect(result).toEqual([]);
    });

    it('2. เพิ่มวิดีโอ favorite ใหม่', () => {
        const video = { video_id: 'vid123', title: 'Video 123' };
        FavoriteModel.addFavorite(video);

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(1);
        expect(favorites[0]).toEqual(video);
    });

    it('3. ไม่เพิ่มวิดีโอซ้ำ', () => {
        const video = { video_id: 'vid123', title: 'Video 123' };
        FavoriteModel.addFavorite(video);
        FavoriteModel.addFavorite(video); // เพิ่มซ้ำ

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(1);
    });

    it('4. เพิ่มหลายวิดีโอที่ไม่ซ้ำกัน', () => {
        FavoriteModel.addFavorite({ video_id: 'vid1', title: 'Video 1' });
        FavoriteModel.addFavorite({ video_id: 'vid2', title: 'Video 2' });

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(2);
    });

    it('5. ลบวิดีโอที่มีอยู่ใน favorites', () => {
        FavoriteModel.addFavorite({ video_id: 'vid1', title: 'Video 1' });
        FavoriteModel.removeFavorite('vid1');

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(0);
    });

    it('6. ลบวิดีโอที่ไม่มีอยู่ใน favorites', () => {
        FavoriteModel.addFavorite({ video_id: 'vid1', title: 'Video 1' });
        FavoriteModel.removeFavorite('vid999');

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(1);
    });

    it('7. ลบวิดีโอจากรายการที่มีหลายรายการ', () => {
        FavoriteModel.addFavorite({ video_id: 'vid1', title: 'Video 1' });
        FavoriteModel.addFavorite({ video_id: 'vid2', title: 'Video 2' });
        FavoriteModel.removeFavorite('vid2');

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(1);
        expect(favorites[0].video_id).toBe('vid1');
    });

    it('8. เช็คว่า addFavorite ไม่เปลี่ยนรายการเดิมเมื่อเพิ่มซ้ำ', () => {
        const video = { video_id: 'vid1', title: 'Video 1' };
        FavoriteModel.addFavorite(video);
        const before = FavoriteModel.getFavorites();

        FavoriteModel.addFavorite(video);
        const after = FavoriteModel.getFavorites();

        expect(after).toEqual(before);
    });

    it('9. ลบวิดีโอหลายอันต่อเนื่อง', () => {
        FavoriteModel.addFavorite({ video_id: 'vid1', title: 'A' });
        FavoriteModel.addFavorite({ video_id: 'vid2', title: 'B' });
        FavoriteModel.addFavorite({ video_id: 'vid3', title: 'C' });

        FavoriteModel.removeFavorite('vid2');
        FavoriteModel.removeFavorite('vid1');

        const favorites = FavoriteModel.getFavorites();
        expect(favorites.length).toBe(1);
        expect(favorites[0].video_id).toBe('vid3');
    });

    it('10. ตรวจสอบว่า getFavorites คืน object ที่มี video_id เสมอ', () => {
        const video = { video_id: 'vid99', title: 'Test Video' };
        FavoriteModel.addFavorite(video);

        const favorites = FavoriteModel.getFavorites();
        expect(favorites[0]).toHaveProperty('video_id');
    });
});
