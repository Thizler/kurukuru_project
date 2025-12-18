const fs = require('fs');
const path = require('path');
const ArrayList = require('./ArrayList'); // ไฟล์ที่สร้างไว้ก่อนหน้า

const stockFilePath = path.join(__dirname, '../data/stock.json');

class StockModel {
    static getAllItems() {
        const data = fs.readFileSync(stockFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        const items = new ArrayList();

        parsed.forEach(item => items.add(item));
        return items;
    }

    static getItemById(itemId) {
        const items = this.getAllItems();
        return items.getAll().find(item => item.id === itemId);
    }

    static saveAllItems(arrayList) {
        const raw = JSON.stringify(arrayList.getAll(), null, 2);
        fs.writeFileSync(stockFilePath, raw, 'utf-8');
    }
}

module.exports = StockModel;
