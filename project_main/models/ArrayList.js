// models/ArrayList.js
class ArrayList {
    constructor(items = []) {
        this.items = Array.isArray(items) ? items : []; // ตรวจสอบให้ items เป็นอาร์เรย์เสมอ
    }

    add(item) {
        this.items.push(item);
    }

    remove(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }

    get(index) {
        return this.items[index];
    }

    // ฟังก์ชันสำหรับการอัพเดตข้อมูล
    update(index, updater) {
        if (index >= 0 && index < this.items.length && typeof updater === 'function') {
            this.items[index] = updater(this.items[index]);
        }
    }

    removeFirst() {
        this.items.shift();
    }

    removeLast() {
        this.items.pop();
    }

    getAll() {
        return [...this.items]; // คืนค่าข้อมูลทั้งหมดในรูปแบบอาร์เรย์
    }

    size() {
        return this.items.length;
    }
}

module.exports = ArrayList;
