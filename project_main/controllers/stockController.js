const StockModel = require('../models/StockModel');

exports.getAllItems = (req, res) => {
    const items = StockModel.getAllItems();
    res.status(200).json(items);
};

exports.getItemById = (req, res) => {
    const { itemId } = req.params;
    const item = StockModel.getItemById(itemId);
    if (item) {
        res.status(200).json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
};