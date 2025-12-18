const CartModel = require('../models/CartModel');

exports.addToCart = (req, res) => {
    const video = req.body.video;
    const cartItems = CartModel.getCartItems();
    const cartItemsArray = Object.values(cartItems);


    if (!cartItemsArray.some((item) => item.video_url === video.video_url)) {
        CartModel.addItemToCart({
            title: video.title || 'Untitled Video',
            price: video.price || 0,
            quantity: 1,
            video_url: video.video_url,
        });
        res.status(200).json({ success: true, message: 'Video added to cart' });
    } else {
        res.status(400).json({ success: false, message: 'Video already in cart or invalid' });
    }
};

exports.renderCart = (req, res) => {
    const cartItems = CartModel.getCartItems().getAll(); // Convert ArrayList to plain array
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    res.render('cart', { cartItems, totalPrice, user: req.session.user });
};



exports.removeMultipleFromCart = (req, res) => {
    const selectedItems = req.body.selectedItems || [];
    console.log('Selected items to remove:', selectedItems);
    if (Array.isArray(selectedItems)) {
        selectedItems.sort((a, b) => b - a).forEach(index => {
            CartModel.removeItemFromCart(index);
        });
    } else if (selectedItems) {
        CartModel.removeItemFromCart(selectedItems);
    }
    res.redirect('/cart');
};




// ลบ item ตัวแรกในตะกร้า
exports.removeItemFirstFromCart = (req, res) => {
    const cartItems = CartModel.getCartItems();
    console.log('✅ kuykkuy');
    if (cartItems.size() > 0) {
        cartItems.removeFirst(); // ใช้เมธอด removeFirst จาก ArrayList
        CartModel.saveCartItems(cartItems); // บันทึกการเปลี่ยนแปลง
        console.log('✅ Removed first item from cart');
    } else {
        console.log('⚠️ Cart is already empty');
    }
    res.redirect('/cart'); // กลับไปที่หน้าตะกร้า
};

// ลบ item ตัวสุดท้ายในตะกร้า
exports.removeItemLastFromCart = (req, res) => {
    const cartItems = CartModel.getCartItems();
    if (cartItems.size() > 0) {
        CartModel.removeItemLastFromCart();
        console.log('✅ Removed last item from cart');
    } else {
        console.log('⚠️ Cart is already empty');
    }
    res.redirect('/cart');
};


exports.renderCheckout = (req, res) => {
    const cartItems = CartModel.getCartItems();
    const totalPrice = cartItems.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('Total Price:', totalPrice); // Debugging line
    res.render('checkout', {
        user: req.session.user,
        cartItems,
        totalPrice,
    });
};

exports.updateQuantity = async (req, res) => {
    const index = parseInt(req.params.index, 10);
    const change = parseInt(req.body.change, 10);
    const cartItems = CartModel.getCartItems();

    if (
        !cartItems ||
        !Array.isArray(cartItems.items) ||
        typeof index !== 'number' ||
        index < 0 ||
        index >= cartItems.items.length
    ) {
        return res.status(400).json({ success: false, message: 'Invalid index or cart data' });
    }


    cartItems.items[index].quantity += change;
    if (cartItems.items[index].quantity < 0) {
        cartItems.items[index].quantity = 0; // ตั้งค่า quantity เป็น 0 ถ้ามันติดลบ
    }// อัปเดตจำนวนสินค้า
    console.log(cartItems); // Debugging line
    if (cartItems.items[index].quantity <= 0) {
        let itemsArray = Array.from(cartItems.items);
        itemsArray.splice(index, 1);
        cartItems.items = itemsArray;
    }
    console.log('Updated cart items:', cartItems); // Debugging line
    CartModel.saveCartItems(cartItems); // บันทึกข้อมูลตะกร้าที่อัปเดตแล้ว


    if (!cartItems || !cartItems.items || !cartItems.items[index]) {
        return res.status(400).json({ success: false, message: 'Invalid cart item index' });
    }

    res.json({
        success: true,
        message: 'Quantity updated',
        newQuantity: cartItems.items[index].quantity

    });

};