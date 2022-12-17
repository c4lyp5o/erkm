require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

const port = process.env.PORT || 6002;
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(routes);

server.use((_, res, next) => {
  res.setHeader(
    'Cache-Control',
    'public, max-age=0, s-maxage=86400, stale-while-revalidate'
  );
  next();
});

const start = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    server.listen(port, () => {
      console.log('Server running at port:', port);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
