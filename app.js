const express = require("express");
const app = express();
app.use(express.urlencoded({extended:true}));

app.listen("3000",function(){
    console.log("Server running on port 3000")
})

app.get("/",function(req,res){
    res.send("yelloooo");
})