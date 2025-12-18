const fs = require('fs');
const path = require('path');
const StockModel = require('../models/StockModel');

// ✅ ระบุไฟล์ที่ใช้
const stockFilePath = path.join(__dirname, '../data/stock.json');

// ✅ Helper สำหรับ reset ไฟล์ stock ก่อนเทส
const resetStockFile = (items = []) => {
    const dir = path.dirname(stockFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(stockFilePath, JSON.stringify(items, null, 2));
};

describe('StockModel Testcases', () => {

    beforeEach(() => {
        resetStockFile([]);
    });

    it('1. getAllItems: ดึงข้อมูลสินค้าทั้งหมด (empty)', () => {
        const items = StockModel.getAllItems();
        expect(items.getAll()).toEqual([]);
    });

    it('2. getAllItems: ดึงข้อมูลสินค้าทั้งหมด (มีข้อมูล)', () => {
        const initialData = [
            { id: 'item1', name: 'Item 1', stock: 10 },
            { id: 'item2', name: 'Item 2', stock: 20 }
        ];
        resetStockFile(initialData);

        const items = StockModel.getAllItems();
        expect(items.getAll()).toEqual(initialData);
    });

    it('3. getItemById: หาสินค้าด้วย ID ที่มีอยู่', () => {
        const initialData = [
            { id: 'item1', name: 'Item 1', stock: 10 }
        ];
        resetStockFile(initialData);

        const item = StockModel.getItemById('item1');
        expect(item).toEqual(initialData[0]);
    });

    it('4. getItemById: หาสินค้าด้วย ID ที่ไม่มีอยู่', () => {
        resetStockFile([
            { id: 'item1', name: 'Item 1', stock: 10 }
        ]);

        const item = StockModel.getItemById('non-existent');
        expect(item).toBeUndefined();
    });

    it('5. saveAllItems: บันทึกข้อมูลสินค้าลงไฟล์', () => {
        const newItems = [
            { id: 'item1', name: 'Item 1', stock: 5 },
            { id: 'item2', name: 'Item 2', stock: 8 }
        ];
        const arrayList = { getAll: () => newItems };

        StockModel.saveAllItems(arrayList);

        const fileContent = JSON.parse(fs.readFileSync(stockFilePath, 'utf-8'));
        expect(fileContent).toEqual(newItems);
    });

    it('6. saveAllItems: บันทึกสินค้าลงไฟล์ (empty array)', () => {
        const arrayList = { getAll: () => [] };

        StockModel.saveAllItems(arrayList);

        const fileContent = JSON.parse(fs.readFileSync(stockFilePath, 'utf-8'));
        expect(fileContent).toEqual([]);
    });

    it('7. getAllItems: ตรวจสอบประเภทที่คืนมา ต้องเป็น ArrayList', () => {
        const items = StockModel.getAllItems();
        expect(typeof items.getAll).toBe('function');  // ต้องมี method getAll()
    });

    it('8. getItemById: รับค่า null เมื่อค้นหา id ใน stock ว่างเปล่า', () => {
        resetStockFile([]);

        const item = StockModel.getItemById('any-id');
        expect(item).toBeUndefined();
    });

    it('9. saveAllItems: บันทึกสินค้าใหม่ทับของเก่าได้', () => {
        const oldData = [
            { id: 'item1', name: 'Old Item', stock: 1 }
        ];
        resetStockFile(oldData);

        const newData = [
            { id: 'item2', name: 'New Item', stock: 100 }
        ];
        const arrayList = { getAll: () => newData };

        StockModel.saveAllItems(arrayList);

        const fileContent = JSON.parse(fs.readFileSync(stockFilePath, 'utf-8'));
        expect(fileContent).toEqual(newData);
    });

    it('10. getAllItems: ข้อมูลใน stock.json ต้องมี key id และ stock', () => {
        const stockData = [
            { id: 'item1', name: 'Item 1', stock: 10 }
        ];
        resetStockFile(stockData);

        const items = StockModel.getAllItems().getAll();
        expect(items[0]).toHaveProperty('id');
        expect(items[0]).toHaveProperty('stock');
    });
});
