

// console.log(module);

module.exports.getDate =function (){
var today = new Date();
var options ={
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric"
};
return today.toLocaleDateString("en-US",options);
}
//shortcut
exports.getDay = function(){
    var today = new Date();
    var options ={
        weekday:"long",

    };
    return today.toLocaleDateString("en-US",options);
    }

