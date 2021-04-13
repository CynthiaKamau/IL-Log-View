const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
var path = require('path');

const app = express();
app.use("/assets",express.static("assets"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ushauri_il"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/views/index.html");
})

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from users where username = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/clients");
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

//when login is success
app.get("/welcome",function(req, res){

    res.sendFile(__dirname + "/views/welcome.html")
})

app.get("/clients", function(req, res){

    connection.query("select * from clients", function(error,results,fields){
        if (error){
            console.log(error)
        } else {
            res.render("clients", {results:results})
        }
    })
})

app.get("/appointments", function(req, res){

    connection.query("select * from appointments", function(error,results,fields){
        if (error){
            console.log(error)
        } else {
            res.render("appointments", {results:results})
        }
    })
})

// set app port 
app.listen(4000);