const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const createError = require('http-errors');

//URI of the mongoDB:
const MONGODB_URI = "mongodb+srv://ofircohen599:OIr8QCc71j4El1Gk@clusterproj.unalvgh.mongodb.net/costsDB";

const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting to mongoDB:
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});

app.use('/api', apiRoutes);

app.use((req, res, next) => {
  next(createError(404, 'API endpoint not found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

module.exports = app;