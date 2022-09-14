const express = require("express");
const app = express();
const date = require(__dirname +"/date.js");
const mongoose = require('mongoose');
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"))
app.use(express.json());



// var items =[];
// var workItems = [];
mongoose.connect("mongodb://localhost:27017/todoListDB");

const itemSchema=new mongoose.Schema({
    name: String
})


const homeList = mongoose.model("Homeitem" , itemSchema);


app.listen("3000",function(){

    console.log("Server running on port 3000")
})
const hw = new homeList({
    name: "Do Homework"
});
const del = new homeList({
    name: "<= Check box to delete"
});
const defaultArr = [hw,del];


app.get("/",function(req,res){
    let day =date.getDay();

    homeList.find(function(err,itemsFound){
// if(itemsFound.length ===0){
//         hw.save();
//         res.redirect("/");

//     }else{
//             console.log("Found it");
//         }

        res.render("list",{day:day , items:itemsFound});

    }
    )



})

// app.post("/work" , function(req,res){
//     let item = req.body.newListItem;


    

//     res.redirect("/work")
// })
// app.get("/work",function(req,res){
//     res.render("list",{day:"Work List" , items : workItems});
// })
const listSchema = mongoose.Schema({
    name : String,
    items: [itemSchema]
});
const list = mongoose.model("list",listSchema);

app.get("/:listName",function(req,res){
    let requestedList = req.params.listName;
    console.log(requestedList);
    list.find({name:requestedList},function(err,foundList){
        if(err){
            console.log(err+"Fahmy")
        }else if(foundList.length === 0){
            const nlist = new list({
                name:requestedList,
                items: defaultArr
            })
            nlist.save();
            res.redirect("/"+requestedList)
        }else{
            console.log(foundList[0].name);
            res.render("list",{day:requestedList , items:foundList[0].items})
        }


    })



    
})



app.post("/",function(req,res){
    // console.log(req.body);
    // console.log(req.params);

    const currentURL = req.body.list;


    let newListItem =new homeList({ name: req.body.todoItem});
    // let customName = req.url.replace(/ \//g , "")

    if(currentURL === date.getDay()){
        newListItem.save();
        console.log(currentURL);
        res.redirect("/");
    }else{
        // list.updateOne({name:currentURL},{items: items.push(newListItem)},function(err){if(err)console.log(err);});
        // list.findOneAndUpdate({name})
                    list.findOneAndUpdate({name:currentURL},{$push: {"items": newListItem}},{safe:true , upsert:true},function(err,model){
                        console.log(err);
                    })
                
        res.redirect("/"+currentURL);

    }



    // if(req.body.list === "Work"){
    //     workItems.push(newListItem);
    //     res.redirect("/work");


    // }else if(req.body.list === "workButton"){
    //     res.redirect("/work");
    // }else if(req.body.list === "aboutButton"){
    //     res.redirect("/about");
    // } else{
    // }

});
app.post("/delete",function(req,res){
    console.log(req.body.checkbox);
    homeList.findByIdAndRemove(req.body.checkbox,function(err){
        if(err) console.log("Error in deletion of item")
    })
    res.redirect("/");
})



app.get("/about",function(req,res){
    res.render("about");
})