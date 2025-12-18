const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const menuController = require('./controllers/menuController');
const trendingController = require('./controllers/trendingController');
const favoriteController = require('./controllers/favoriteController');
const cartController = require('./controllers/cartController');

const app = express();

const profiler = require('./middleware/profiling'); //  ใช้งาน profiler

app.use(profiler); //  ใช้งาน profiler ก่อน routes

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: false }));

// Session setup
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Auth routes
app.get('/register', authController.renderRegister);
app.post('/register', authController.register);
app.get('/login', authController.renderLogin);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

// Task routes
app.get('/', authController.authenticate, taskController.renderTasks);
app.post('/add', authController.authenticate, taskController.addTask);
app.post('/delete', authController.authenticate, taskController.deleteTasks);
app.post('/search', authController.authenticate, taskController.searchTasks);
app.get('/sort', authController.authenticate, taskController.sortTasks);
app.get('/view/:name', authController.authenticate, taskController.viewTask);

// Menu routes
app.get('/menu', authController.authenticate, menuController.renderMenu);
app.post('/menu', authController.authenticate, menuController.renderMenu);
app.get('/setting', menuController.renderSetting);

// Favorite routes
app.get('/favorite', authController.authenticate, favoriteController.renderFavorites);
app.post('/favorite', authController.authenticate, favoriteController.addToFavorite);

// Cart routes
app.get('/cart', authController.authenticate, cartController.renderCart);
app.post('/cart', authController.authenticate, cartController.addToCart);
app.post('/cart/update/:index', authController.authenticate, cartController.updateQuantity);
app.post('/cart/remove-multiple', authController.authenticate, cartController.removeMultipleFromCart);
app.post('/cart/remove-first', cartController.removeItemFirstFromCart);
app.post('/cart/remove-last', cartController.removeItemLastFromCart);
app.post('/cart/checkout', authController.authenticate, cartController.renderCheckout);

// Optional advanced features (only use these if they are implemented in menuController.js)
if (menuController.addToFavorite) {
  app.post('/favorite', authController.authenticate, menuController.addToFavorite);
  app.get('/favorite', authController.authenticate, menuController.renderFavorites);
}
if (menuController.addToCart) {
  app.post('/cart', authController.authenticate, menuController.addToCart);
  app.get('/cart', authController.authenticate, menuController.renderCart);
  app.post('/cart/update/:index', authController.authenticate, cartController.updateQuantity);
  app.post('/cart/remove/:index', authController.authenticate, cartController.removeFromCart);
  app.post('/cart/remove-multiple', authController.authenticate, menuController.removeMultipleFromCart);
  app.post('/cart/checkout', authController.authenticate, menuController.renderCheckout);
}

app.get('/trending', authController.authenticate, trendingController.renderTrending);

// Checkout confirm route (dummy implementation)
app.post('/checkout/confirm', (req, res) => {
  res.render('thankyou');
});

// Fallback route
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
