// jshint esversion: 6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const date = require(__dirname + '/date.js');

const app = express();

main().catch(err => console.log(err));

async function main() {
    mongoose.connect("mongodb://127.0.0.1:27017/todoListDB", { useNewUrlParser: true });
    console.log("Connected successfully to server");
    
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const itemsSchema = new mongoose.Schema({
    name: String,
});

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
    name: 'Welcome to your todo list!'
});
const item2 = new Item({
    name: 'Hi tthe + button to add a new item.'
});
const item3 = new Item({
    name: '<--- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    // let day = date.getDate();

    Item.find({})
    .then(function(items) {
        // res.render('list', {listTitle: day, newListItems: items});

        if(items.length === 0) {
            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("successfully saved dafault items to db");
                })
                .catch(function (err) {
                    console.log(err);
                });

            // redirect - root
            res.redirect("/");
        } else {

            // render
            res.render('list', {listTitle: "Today", newListItems: items});
        }
    })
    .catch(function (err) {
        console.log(err);
    });


});

app.post("/", (req, res) => {
    let itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/")

});

app.post("/delete", (req, res) => {
    console.log((req.body.checkbox));
    let checkedItemId = req.body.checkbox;

    const item = new Item({
        _id: checkedItemId
    });

    Item.findByIdAndRemove(checkedItemId)
    .then(function (res) {
        console.log("succesfully deleted item");  
    })
    .catch(function (err) {
        console.log(err);
    });
    res.redirect("/")

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