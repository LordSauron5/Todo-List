// jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

let items = [
    "Buy Food",
    "Cook Food",
    "Eat Food"
];

let workItems = [
    "Food",
    "Stuff",
];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    res.render('list', {listTitle: day, newListItems: items});

});

app.post("/", (req, res) => {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect('/work');
    } else {
        items.push(item);
        res.redirect('/');
    }

});

app.post("/work", (req, res) => {
    let item = req.body.newItem;

    workItems.push(item);

    res.redirect('/work');
});

app.get("/work", (req, res) => {
    res.render('list', {listTitle: "Work List", newListItems: workItems});
})

app.get("/about", (req, res) => {
    res.render('about');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000 (local)");
});