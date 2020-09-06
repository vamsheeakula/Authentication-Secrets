//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Mongo DB Connections
const dataBase = "userDB" ;
mongoose.connect("mongodb://localhost:27017/"+dataBase,{useNewUrlParser: true, useUnifiedTopology: true });

// Schema Creation
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Create Secret for encryption

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });


//Model
const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home",{invalidCredentials: ""});
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(request,response){
  const regUser = new User({
    email: request.body.username,
    password: request.body.password
  });
  regUser.save(function(err,res){
    if(!err){
      console.log("User Registered Successfully");
      response.render("secrets");
    }else{
      console.log(err);
    }
  });
});

app.post("/login",function(req,res){
  const username= req.body.username;
  const password= req.body.password;
  User.findOne({email: username},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          console.log("USer Logged in");
          res.render("secrets");
        }else{
          const invalidCredentials = "Invalid Credentials, please login back";
          console.log("Invalid credentials");
          res.render("home",{invalidCredentials: invalidCredentials});
        }
      }
    }else{
      console.log(err);
    }
  })


});



app.listen(3000,function(req,res){
  console.log("App started to listen on 3000")
})
