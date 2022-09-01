const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

app.listen("3000",function(){

    console.log("Server running on port 3000")
})

app.get("/",function(req,res){
    var today = new Date().getDay();
    var day= null;
    var obj = {
        name: "fahmy",
        age:"21",
        gender:"male"
    };

    switch(today){
        case 0:
            day="Sunday";
            break;
        case 1:
            day="Monday";
            break;
        case 2:
            day="Tuesday";
            break;
        case 3:
            day="Wednesday";
            break;
        case 4:
            day="Thursday";
            break;
        case 5:
            day="Friday";
            break;
        case 6:
            day="Saturday";
            break;
        default:
            console.log("Error current day not from 0 ~ 6")
            break;
                    
    }
    res.render("list",{obj:obj});
})