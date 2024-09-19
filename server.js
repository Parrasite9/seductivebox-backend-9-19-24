const express = require('express');
const fileUpload = require('express-fileupload'); // Ensure express-fileupload is used
const session = require('express-session');
const pool = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(fileUpload());  // To handle file uploads
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products')); // Make sure this is pointing to the products route
app.use('/api/cart', require('./routes/cart'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
