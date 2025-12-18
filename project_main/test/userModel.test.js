const fs = require('fs');
const UserModel = require('../models/UserModel');
const ArrayList = require('../models/ArrayList');
const path = require('path');

// Mock fs.readFileSync และ fs.writeFileSync
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    writeFileSync: jest.fn(),
}));

describe('UserModel Testcases', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks ก่อนทุก test case
    });

    it('1. ควรดึงข้อมูลผู้ใช้ทั้งหมดจากไฟล์ JSON', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const users = UserModel.getAllUsers();

        // เช็คจำนวนผู้ใช้ใน ArrayList
        expect(users.items.length).toBe(2);
        expect(users.items[0]).toEqual({ username: 'user1', password: 'password1' });
        expect(users.items[1]).toEqual({ username: 'user2', password: 'password2' });
    });

    it('2. ควรค้นหาผู้ใช้จาก username', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const user = UserModel.getUserByUsername('user1');

        // เช็คว่าผู้ใช้ที่ได้ตรงกับที่คาดหวัง
        expect(user).toEqual({ username: 'user1', password: 'password1' });
    });

    it('3. ควรคืนค่า undefined หากไม่พบผู้ใช้จาก username', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
            { username: 'user2', password: 'password2' },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const user = UserModel.getUserByUsername('user3');

        // เช็คว่าไม่พบผู้ใช้
        expect(user).toBeUndefined();
    });

    it('4. ควรเพิ่มผู้ใช้ใหม่ลงใน ArrayList และบันทึกไฟล์ JSON', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const newUser = { username: 'user2', password: 'password2' };
        UserModel.addUser(newUser);

        // เช็คว่าไฟล์ถูกบันทึกด้วยข้อมูลใหม่
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.join(__dirname, '../data/user.json'),
            JSON.stringify([{ username: 'user1', password: 'password1' }, { username: 'user2', password: 'password2' }], null, 2)
        );
    });

    it('5. ควรจัดการกรณีที่ไฟล์ JSON ไม่มีผู้ใช้', () => {
        const fakeData = [];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const users = UserModel.getAllUsers();

        // เช็คว่า ArrayList ว่างเปล่า
        expect(users.items).toEqual([]);
    });

    it('6. ควรตรวจสอบกรณีที่ไฟล์ JSON มีข้อมูลที่ผิดรูปแบบ', () => {
        const fakeData = "Invalid JSON";
        fs.readFileSync.mockReturnValueOnce(fakeData);

        expect(() => UserModel.getAllUsers()).toThrowError(SyntaxError);
    });

    it('7. ควรจัดการกรณีที่ไฟล์ user.json ไม่มีการเข้าถึง (เช่น ไม่มีสิทธิ์เขียน)', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));
        fs.writeFileSync.mockImplementationOnce(() => {
            throw new Error('Permission denied');
        });

        const newUser = { username: 'user2', password: 'password2' };

        expect(() => UserModel.addUser(newUser)).toThrowError('Permission denied');
    });

    it('8. ควรจัดการกรณีที่ไฟล์ user.json ไม่มีข้อมูลเมื่อเรียกใช้ฟังก์ชัน getUserByUsername', () => {
        fs.readFileSync.mockReturnValueOnce('[]');  // ไฟล์เป็นอาร์เรย์ว่าง

        const user = UserModel.getUserByUsername('user1');

        // เช็คว่าไม่พบผู้ใช้เนื่องจากไฟล์ว่าง
        expect(user).toBeUndefined();
    });
    it('9. ควรจัดการกรณีที่ข้อมูลผู้ใช้ในไฟล์ JSON มีค่าผิดประเภท', () => {
        const fakeData = [
            { username: 'user1', password: 'password1' },
            { username: 123, password: true },  // ข้อมูลผิดประเภท
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const users = UserModel.getAllUsers();

        // เช็คว่า ArrayList มีข้อมูลที่ถูกต้องเท่านั้น
        expect(users.items.length).toBe(2);
        expect(users.items[0]).toEqual({ username: 'user1', password: 'password1' });
        expect(users.items[1]).toEqual({ username: 123, password: true });  // แม้ว่าจะเป็นข้อมูลผิดประเภท
    });

    it('10. ควรตรวจสอบกรณีที่ผู้ใช้มีข้อมูลที่เป็นค่า null หรือ undefined', () => {
        const fakeData = [
            { username: 'user1', password: null },  // ข้อมูลที่เป็น null
            { username: 'user2', password: undefined },  // ข้อมูลที่เป็น undefined
        ];
        fs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeData));

        const users = UserModel.getAllUsers();

        // เช็คว่า ArrayList มีข้อมูลที่เป็นค่า null หรือ undefined
        expect(users.items[0]).toEqual({ username: 'user1', password: null });
        expect(users.items[1]).toEqual({ username: 'user2', password: undefined });
    });

});
