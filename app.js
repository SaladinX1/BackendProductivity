const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const db = require('./database/db.script');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Ajoutez PATCH à la liste des méthodes autorisées
}));

const dotenv = require('dotenv');

dotenv.config();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

  ///////////////////////

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, HEAD, PATCH');
    next();
});




 app.use('images',express.static(path.join(__dirname, 'images')));


app.use('/api', userRoutes);

app.use('/api', postRoutes);

app.use('/api', commentRoutes);

module.exports = app;