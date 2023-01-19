//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://harshitthakur:harshit@cluster0.osvhze4.mongodb.net/Todo?retryWrites=true&w=majority', { useNewUrlParser: true });



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const workItems = [];


const itemScheme = {
  name: String
}

const item = mongoose.model("item", itemScheme);

const item1 = new item({
  name: "welcome to do list!"
})
const item2 = new item({
  name: "HIT the + button to aff a new item"
})
const item3 = new item({
  name: "<-- hit this to delete an item"
})
const defualtItem = [item1, item2, item3];


const curListScheme={
  name:String,
  Items:[itemScheme]
}
const curList=mongoose.model("List",curListScheme);

app.get("/", function (req, res) {

  item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      item.insertMany(defualtItem, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("successfully added default");
        }
      })
      res.redirect("/");

    }
    else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  })



})

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName=req.body.list;
  const items = new item({
    name: itemName
  });
  if(listName==='Today')
  {
  items.save();
  res.redirect("/");
  }
  else{
    curList.findOne({name:listName},function(err,foundList){
      foundList.Items.push(items);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
});

app.post("/delete", function (req, res) {
  const itemid = req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
  item.findByIdAndRemove(itemid, function (err) {
    if (!err) {
      console.log("succesfully deleted")
    }
    res.redirect("/");
  })}
  else{

    curList.findOneAndUpdate({name:listName},{$pull:{Items:{_id:itemid}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })
  }
})


app.get("/:currentList",function(req,res){
  const CurrentListName=req.params.currentList;

  curList.findOne({name:CurrentListName},function(err,foundList){
    if(!err)
    {
      if(!foundList)
      {
        const NewList= new curList({
          name:CurrentListName,
          Items:defualtItem
        });
        NewList.save();
        res.redirect("/"+CurrentListName);
      }
      else{

        res.render("list",{listTitle:foundList.name , newListItems:foundList.Items});
      }
    }
  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
