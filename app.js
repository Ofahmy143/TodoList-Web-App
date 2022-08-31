const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));

app.listen("3000",function(){

    console.log("Server running on port 3000")
})

app.get("/",function(req,res){
    var today = new Date();
    if(today.getDay() === 3 || today.getDay()===0 ){
        res.send("yay it's the weekend");
    }else{
        res.send("I have to go to work!!");
    }
})