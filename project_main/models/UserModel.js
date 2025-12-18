const fs = require('fs');
const path = require('path');
const ArrayList = require('./ArrayList');  // นำเข้า ArrayList

const userFilePath = path.join(__dirname, '../data/user.json');

class UserModel {
    static getAllUsers() {
        const data = fs.readFileSync(userFilePath, 'utf-8');
        const users = JSON.parse(data);
        const userList = new ArrayList();  // สร้าง ArrayList ใหม่

        users.forEach(user => userList.add(user));  // เพิ่มผู้ใช้ลงใน ArrayList

        return userList;
    }

 
    static getUserByUsername(username) {
        const userList = this.getAllUsers();
        return userList.items.find(user => user.username === username); // ค้นหาผู้ใช้ตาม username
    }

    static addUser(user) {
        const userList = this.getAllUsers();
        userList.add(user);  // เพิ่มผู้ใช้ใหม่
        fs.writeFileSync(userFilePath, JSON.stringify(userList.items, null, 2));  // บันทึกเป็นไฟล์ JSON
    }
}

module.exports = UserModel;
