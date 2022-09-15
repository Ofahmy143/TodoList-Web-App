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

app.get("/lists/:listName",function(req,res){
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

                    list.findOneAndUpdate({name:currentURL},{$push: {"items": newListItem}},{safe:true , upsert:true},function(err,model){
                        console.log(err);
                    })
                
        res.redirect("/lists/"+currentURL);

    }

});
app.post("/delete",function(req,res){
    const arr = req.body.checkbox.split(",")
    const listHeader = arr[0];
    const item_id = arr[1];
    if(listHeader === date.getDay()){
        homeList.findByIdAndRemove(item_id,function(err){
            if(err) {console.log("Error in deletion of item first one");
        console.log(err)}
        })
        res.redirect("/");
    }else if(listHeader === "lists"){

        list.findByIdAndRemove(item_id,function(err){
            if(err) console.log(err);
        })
        res.redirect("/lists")


    }else{
        list.find({name:listHeader},function(err,foundLists){
            const itemsArr = foundLists[0].items

            itemsArr.forEach(function(item) {
                if(item_id === item.id){

                    list.updateOne({name:listHeader},{$pull: {items:item} },function(err){
                        if(err) console.log(err);
                    });
                }else{

                }
            });
            })
            res.redirect("/lists/"+listHeader);
        }
    }

)



app.get("/about",function(req,res){
    res.render("about");
})

app.post("/lists",function(req,res){
    res.redirect("/lists");
})

app.get("/lists",function(req,res){
    list.find(function(err,foundLists){
        // res.send(foundLists)
        res.render("list",{day:"lists" , items:foundLists});

    })
})