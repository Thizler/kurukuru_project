const fs = require('fs');
const path = require('path');
const ArrayList = require('./ArrayList'); // Import ArrayList

const cartFilePath = path.join(__dirname, '../data/cart.json');

class CartModel {
    static getCartItems() {
        const data = fs.readFileSync(cartFilePath, 'utf-8');
        const items = JSON.parse(data);
        return new ArrayList(items); // Return as ArrayList
    }

    static saveCartItems(cartItems) {
        fs.writeFileSync(cartFilePath, JSON.stringify(cartItems.getAll(), null, 2)); // Save ArrayList items
    }

    static addItemToCart(item) {
        const cartItems = this.getCartItems();
        cartItems.add(item); // Use ArrayList's add method
        this.saveCartItems(cartItems);
    }

    static removeItemFromCart(index) {
        const cartItems = this.getCartItems();
        cartItems.remove(index); // Use ArrayList's remove method
        this.saveCartItems(cartItems);
    }

    static removeItemFirstFromCart() {
        const cartItems = this.getCartItems();
        cartItems.removeFirst(); // Remove first item
        this.saveCartItems(cartItems);
    }

    static removeItemLastFromCart() {
        const cartItems = this.getCartItems();
        cartItems.removeLast(); // ใช้เมธอด pop() ผ่าน removeLast() ของ ArrayList
        this.saveCartItems(cartItems);
    }

    static async updateItemQuantity(itemId, change) {
        const cartItems = this.getCartItems();
        const index = cartItems.getAll().findIndex(item => item.id === itemId); // Find item index

        if (index !== -1) {
            const item = cartItems.get(index);
            item.quantity = Math.max(0, item.quantity + change); // Update quantity

            if (item.quantity === 0) {
                cartItems.remove(index); // Remove item if quantity is 0
            } else {
                cartItems.update(index, item); // Update item in ArrayList
            }

            this.saveCartItems(cartItems);
            return item.quantity;
        } else {
            throw new Error('Item not found in cart');
        }
    }
}

module.exports = CartModel;
