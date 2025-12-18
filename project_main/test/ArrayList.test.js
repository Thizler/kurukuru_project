const ArrayList = require('../models/ArrayList');

describe('ArrayList', () => {
    let arrayList;

    beforeEach(() => {
        arrayList = new ArrayList();
    });

    it('1.ควรเริ่มต้นด้วยรายการว่าง', () => {
        expect(arrayList.getAll()).toEqual([]);
        expect(arrayList.size()).toBe(0);
    });

    it('2.ควรเพิ่มรายการได้', () => {
        arrayList.add('item1');
        expect(arrayList.getAll()).toEqual(['item1']);
        expect(arrayList.size()).toBe(1);
    });

    it('3.ควรลบรายการตาม index ได้', () => {
        arrayList.add('item1');
        arrayList.add('item2');
        arrayList.remove(0);
        expect(arrayList.getAll()).toEqual(['item2']);
        expect(arrayList.size()).toBe(1);
    });

    it('4.ควรไม่ลบถ้า index ไม่ถูกต้อง', () => {
        arrayList.add('item1');
        arrayList.remove(5); // index เกิน
        expect(arrayList.getAll()).toEqual(['item1']);
        expect(arrayList.size()).toBe(1);
    });

    it('5.ควรได้ค่าถูกต้องตาม index', () => {
        arrayList.add('item1');
        arrayList.add('item2');
        expect(arrayList.get(1)).toBe('item2');
    });

    it('6.ควรอัปเดตค่าตาม index ได้', () => {
        arrayList.add({ value: 1 });
        arrayList.update(0, (item) => ({ value: item.value + 1 }));
        expect(arrayList.get(0)).toEqual({ value: 2 });
    });

    it('7.ควรไม่อัปเดตถ้า index ไม่ถูกต้อง', () => {
        arrayList.add({ value: 1 });
        arrayList.update(5, (item) => ({ value: item.value + 1 })); // ไม่ error แต่ไม่ทำอะไร
        expect(arrayList.get(0)).toEqual({ value: 1 });
    });

    it('8.ควรลบรายการตัวแรกได้', () => {
        arrayList.add('item1');
        arrayList.add('item2');
        arrayList.removeFirst();
        expect(arrayList.getAll()).toEqual(['item2']);
    });

    it('9.ควรลบรายการตัวสุดท้ายได้', () => {
        arrayList.add('item1');
        arrayList.add('item2');
        arrayList.removeLast();
        expect(arrayList.getAll()).toEqual(['item1']);
    });

    it('10.ควรสร้างจาก items ที่กำหนดได้', () => {
        const list = new ArrayList(['a', 'b']);
        expect(list.getAll()).toEqual(['a', 'b']);
        expect(list.size()).toBe(2);
    });

    it('11.ควรสร้างรายการว่างเมื่อส่งค่าไม่ใช่อาร์เรย์', () => {
        const list = new ArrayList('not an array');
        expect(list.getAll()).toEqual([]);
        expect(list.size()).toBe(0);
    });
});
