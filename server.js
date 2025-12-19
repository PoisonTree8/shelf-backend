const dotenv = require('dotenv');

dotenv.config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const PORT = process.env.PORT || 3000;

// Controllers
const authCtrl = require('./src/controllers/auth');
const usersCtrl = require('./src/controllers/users');
const booksCtrl = require('./src/controllers/books');
const purchasesCtrl = require('./src/controllers/purchases');

// MiddleWare
const verifyToken = require('./src/middleware/verify-token');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public
app.use('/auth', authCtrl);


// Protected Routes
app.use('/users', verifyToken, usersCtrl);
app.use('/books', booksCtrl);
app.use('/purchases', purchasesCtrl);



app.listen(PORT, () => {
  console.log('The express app is ready!');
});