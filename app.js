//jshint esversion:6
require("dotenv").config()

const express=require("express");

const app=express();

const ejs=require("ejs");

const bodyParser=require("body-parser");

const mongoose=require("mongoose");

const encrypt=require("mongoose-encryption");

const secret=process.env.SECRET;

const depreceated={
	useNewUrlParser: true,
	useUnifiedTopology: true
}

mongoose.connect("mongodb://localhost:27017/userDB",depreceated)

//schema

const userSchema=new mongoose.Schema({
	email:String,
	password:String
});

//encryption secret SHOULD BE CREATED BEFORE MODEL


userSchema.plugin(encrypt, { secret: secret,encryptedFields:["password"]});//encryption is applied to password by encryptedField

//model

const User=new mongoose.model("User",userSchema);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set('view engine','ejs');

app.get("/",function(req,res){
	res.render("home");
})

app.get("/register",function(req,res){
	res.render("register");
})


app.get("/login",function(req,res){
	res.render("login");
})


app.post("/register",function(req,res){
	const newUser=new User({
		email: req.body.username,
		password:req.body.password
	})

	newUser.save(function(err){

		if(err){
			console.log(err);
		}
		else{
			console.log("registered");
			res.render("secrets");
		}
	});

})


app.post("/login",function(req,res){
	const username=req.body.username;
	const password=req.body.password;
	User.findOne({email:username},function(err,foundUser){
		if((err) || (!foundUser)){
			
			console.log(err);
		}
		else{
			if(foundUser){
				if(foundUser.password===password){
					res.render("secrets");
				}
				

			}
			
		}
	});
})









app.listen(3000,function(){
	console.log("Server started");
});
