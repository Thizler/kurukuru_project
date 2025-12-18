const fs = require('fs');
const path = require('path');
const CartModel = require('../models/CartModel');

// ✅ แก้ path ให้ถูกต้อง
const cartFilePath = path.join(__dirname, '../data/cart.json');

// Helper: Reset cart ก่อนทุกเทส
const resetCartFile = (items = []) => {
    // ถ้าโฟลเดอร์ data ไม่มี ให้สร้าง
    const dir = path.dirname(cartFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(cartFilePath, JSON.stringify(items, null, 2));
};

describe('CartModel UI Testcases', () => {
    beforeEach(() => {
        resetCartFile([]);
    });

    it('1. เพิ่มสินค้าลงในตะกร้า', () => {
        const newItem = { id: 'item1', quantity: 1 };
        CartModel.addItemToCart(newItem);

        const cartItems = CartModel.getCartItems().getAll();
        expect(cartItems.length).toBe(1);
        expect(cartItems[0]).toEqual(newItem);
    });

    it('2. ลบสินค้าตำแหน่งแรกในตะกร้า', () => {
        resetCartFile([
            { id: 'item1', quantity: 1 },
            { id: 'item2', quantity: 2 },
        ]);

        CartModel.removeItemFirstFromCart();
        const cartItems = CartModel.getCartItems().getAll();

        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe('item2');
    });

    it('3. ลบสินค้าตำแหน่งสุดท้ายในตะกร้า', () => {
        resetCartFile([
            { id: 'item1', quantity: 1 },
            { id: 'item2', quantity: 2 },
        ]);

        CartModel.removeItemLastFromCart();
        const cartItems = CartModel.getCartItems().getAll();

        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe('item1');
    });

    it('4. เพิ่มจำนวนสินค้าในตะกร้า', async () => {
        resetCartFile([{ id: 'item1', quantity: 1 }]);

        const newQuantity = await CartModel.updateItemQuantity('item1', 2);
        const cartItems = CartModel.getCartItems().getAll();

        expect(newQuantity).toBe(3);
        expect(cartItems[0].quantity).toBe(3);
    });

    it('5. ลดจำนวนสินค้าเหลือ 0 แล้วลบออก', async () => {
        resetCartFile([{ id: 'item1', quantity: 1 }]);

        const newQuantity = await CartModel.updateItemQuantity('item1', -1);
        const cartItems = CartModel.getCartItems().getAll();

        expect(newQuantity).toBe(0);
        expect(cartItems.length).toBe(0);
    });

    it('6. updateItemQuantity: สินค้าไม่เจอ => ต้อง throw error', async () => {
        expect.assertions(1);

        try {
            await CartModel.updateItemQuantity('non-existent', 1);
        } catch (error) {
            expect(error.message).toBe('Item not found in cart');
        }
    });

    it('7. removeItemFromCart: ลบสินค้าตำแหน่งที่กำหนด', () => {
        resetCartFile([
            { id: 'item1', quantity: 1 },
            { id: 'item2', quantity: 2 },
        ]);

        CartModel.removeItemFromCart(1);
        const cartItems = CartModel.getCartItems().getAll();

        expect(cartItems.length).toBe(1);
        expect(cartItems[0].id).toBe('item1');
    });

    it('8. เพิ่มสินค้าในตะกร้าที่มีสินค้าอยู่แล้ว', () => {
        resetCartFile([
            { id: 'item1', quantity: 1 },
            { id: 'item2', quantity: 2 },
        ]);

        const newItem = { id: 'item3', quantity: 1 };
        CartModel.addItemToCart(newItem);

        const cartItems = CartModel.getCartItems().getAll();
        expect(cartItems.length).toBe(3);
        expect(cartItems[2]).toEqual(newItem);
    });

    it('9. ลบสินค้าจากตำแหน่งที่กำหนดในตะกร้า', () => {
        resetCartFile([
            { id: 'item1', quantity: 1 },
            { id: 'item2', quantity: 2 },
            { id: 'item3', quantity: 3 },
        ]);

        CartModel.removeItemFromCart(1);
        const cartItems = CartModel.getCartItems().getAll();

        expect(cartItems.length).toBe(2);
        expect(cartItems[0].id).toBe('item1');
        expect(cartItems[1].id).toBe('item3');
    });

    it('10. เพิ่มจำนวนสินค้าที่มีอยู่แล้วในตะกร้า', async () => {
        resetCartFile([{ id: 'item1', quantity: 1 }]);

        const newQuantity = await CartModel.updateItemQuantity('item1', 2);
        const cartItems = CartModel.getCartItems().getAll();

        expect(newQuantity).toBe(3);
        expect(cartItems[0].quantity).toBe(3);
    });
});
