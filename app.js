const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
mongoose.connect("mongodb://127.0.0.1:27017/todolistdb",{useNewUrlParser:true})
const itemsSchema = {
    name: String
}
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name:"cooking food"
})
const item2 = new Item({
    name:"eating food"
})
const item3 = new Item({
    name:"enjoying food"
})
 const defaultItems = [item1,item2,item3];

const listSchema = {
    name:String,
    items: [itemsSchema]
};
const List = mongoose.model("List",listSchema)
app.get("/",function(req,res){
    
     
   
    Item.find({}).then(function(foundItems){
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems).then(function(){
            console.log("successfully added the items")
            }).catch(function(err){
                console.log(err)
            })
            res.redirect("/");
        } else {
            res.render("list",{ListTitle: "Today", newListItems: foundItems});
        }
    }).catch(function(err){
        console.log(err)
    })
   

});
app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName;
    List.findOne({name:customListName}).then(function(err,foundList){
         if(!err) {
            if(!foundList) {
                const list = new List({
                    name : customListName,
                    items: defaultItems
                })
                list.save();
            } else {
                console.log("exists!")
                res.render("list",{ListTitle: foundList.name, newListItems: foundItems.items})
            }
         }
        })
})
app.post("/",function (req,res) {
    var itemName = req.body.newItem;
    
    const item = new Item({
        name:itemName
    })

    item.save();
    res.redirect("/");
})
app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox
    Item.findByIdAndRemove(checkedItemId).then(function(){
        console.log("successfully deleted the checked item")
        res.redirect("/")
    })
    
})

app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000,function(){
  console.log("port number 3000 is running")
});
