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
    name: 'Hi the + button to add a new item.'
});
const item3 = new Item({
    name: '<--- Hit this to delete an item.'
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model('List', listSchema);



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
    const listName = req.body.list

    const item = new Item({
        name: itemName
    });


    if(listName === "Today") {
        item.save();
        res.redirect("/")
    } else {

        List.findOne({name: listName})
        .then(function (foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + foundList.name)
        })
        .catch(function (err) {
            console.log(err);
        });
    }


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

app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;

    List.findOne({name: customListName})
    .then(function (foundList){
        // show existing list
        res.render("list", {listTitle: foundList.name,  newListItems: foundList.items});
    })
    .catch(function (err) {
        // create new list
        const list = new List({
            name: customListName,
            items: defaultItems
        });
    
        list.save();

        res.redirect("/" + customListName);
    });

    

});

app.get("/about", (req, res) => {
    res.render('about');
})

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running on port 3000 (local)");
});