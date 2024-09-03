require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const toDoListRoute = require('./routes/toDoListRoute');

const app = express();

const dbURL = process.env.MONGODB_URL;

mongoose.connect(dbURL)
.then((result)=>{
    app.listen(3000);
})
.catch((err) => {
    console.log(err);
});


app.use(express.static('assets'));
app.use(express.static('attachments'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(toDoListRoute);

//404 page
app.use((req, res)=>{
    res.render('404', {title: '404', categories: []});
});
