const fs = require('fs');
const VideoModel = require('../models/VideoModel');
const ArrayList = require('../models/ArrayList'); // import ArrayList

// Mock fs.readFileSync
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
}));

describe('VideoModel Testcases', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test case
    });

    it('1. ควรดึงข้อมูล videos จากไฟล์ JSON', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 1, title: 'Video 1' }, { id: 2, title: 'Video 2' }] },
            { name: 'subcategory', data: [] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่าข้อมูลที่ได้ตรงกับที่คาดหวัง
        expect(videos.getAll().length).toBe(2);
        expect(videos.getAll()[0]).toEqual({ id: 1, title: 'Video 1' });
        expect(videos.getAll()[1]).toEqual({ id: 2, title: 'Video 2' });
    });

    it('2. ควรดึงข้อมูล subcategories จากไฟล์ JSON', () => {
        const fakeData = [
            { name: 'videos', data: [] },
            { name: 'subcategory', data: [{ id: 1, name: 'Subcategory 1' }] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const subcategories = VideoModel.getSubcategories();

        // เช็คว่าข้อมูลที่ได้ตรงกับที่คาดหวัง
        expect(subcategories.getAll().length).toBe(1);
        expect(subcategories.getAll()[0]).toEqual({ id: 1, name: 'Subcategory 1' });
    });

    it('3. ควรคืนค่าข้อมูลที่มีการจัดรูปแบบใน video table', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 1, title: 'Formatted Video' }] },
            { name: 'subcategory', data: [] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        expect(videos.getAll()[0]).toEqual({ id: 1, title: 'Formatted Video' });
    });

    it('4. ควรเช็คว่ามี table videos ในไฟล์ JSON หรือไม่', () => {
        const fakeData = [
            { name: 'subcategory', data: [{ id: 1, name: 'Subcategory 1' }] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่า ArrayList ว่างเปล่า เนื่องจากไม่มี table videos
        expect(videos.getAll()).toEqual([]);
    });

    it('5. ควรเช็คว่ามี table subcategory ในไฟล์ JSON หรือไม่', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 1, title: 'Video 1' }] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const subcategories = VideoModel.getSubcategories();

        // เช็คว่า ArrayList ว่างเปล่า เนื่องจากไม่มี table subcategory
        expect(subcategories.getAll()).toEqual([]);
    });
    it('6. ควรจัดการกรณีที่ videos table เป็น array ว่าง', () => {
        const fakeData = [
            { name: 'videos', data: [] },  // ไม่มีข้อมูลใน table 'videos'
            { name: 'subcategory', data: [{ id: 1, name: 'Subcategory 1' }] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่า ArrayList ของ videos ว่างเปล่า
        expect(videos.getAll()).toEqual([]);
    });

    it('7. ควรจัดการกรณีที่ subcategory table เป็น array ว่าง', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 1, title: 'Video 1' }] },
            { name: 'subcategory', data: [] },  // ไม่มีข้อมูลใน table 'subcategory'
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const subcategories = VideoModel.getSubcategories();

        // เช็คว่า ArrayList ของ subcategories ว่างเปล่า
        expect(subcategories.getAll()).toEqual([]);
    });

    it('8. ควรจัดการกรณีที่ videos table มีข้อมูลผิดพลาดหรือไม่ได้อยู่ในรูปแบบที่คาดหวัง', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 'wrong_id', title: 123 }] },  // ข้อมูลผิดประเภท
            { name: 'subcategory', data: [] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่า videos ยังสามารถดึงข้อมูลออกมาได้อย่างถูกต้องแม้ข้อมูลจะผิดประเภท
        expect(videos.getAll()[0]).toEqual({ id: 'wrong_id', title: 123 });
    });

    it('9. ควรจัดการกรณีที่ videos table มีข้อมูลที่มีค่า null หรือ undefined', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: null, title: undefined }] },  // ข้อมูลที่เป็น null หรือ undefined
            { name: 'subcategory', data: [] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่า videos สามารถดึงข้อมูลที่มีค่า null หรือ undefined ออกมาได้
        expect(videos.getAll()[0]).toEqual({ id: null, title: undefined });
    });
    it('10. ควรจัดการกรณีที่ไฟล์ JSON มีข้อมูลที่มีฟิลด์หายไป', () => {
        const fakeData = [
            { name: 'videos', data: [{ id: 1 }] },  // ฟิลด์ 'title' หายไป
            { name: 'subcategory', data: [] },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const videos = VideoModel.getVideos();

        // เช็คว่า videos ยังสามารถดึงข้อมูลที่มีฟิลด์หายไปได้
        expect(videos.getAll()[0]).toEqual({ id: 1 }); // คาดหวังแค่ id เนื่องจากไม่มี title
    });
});
