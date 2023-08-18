const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const port = 7080;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
//const bodyparser = require('body-parser');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'CreativeSun',
	database: 'MHEALTHTRACK',
	password: 'Bhuvanesh@06'
});

app.use(session({
	secret : "IT IS A SECRET",
	resave: false,
	saveUninitialized: true
}))
app.set("view engine","ejs")
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({extended : false}))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'app')));
app.use(express.json());
app.get('/login',function(req,res){
	res.render("signup");
});

app.get('/cspy',(req,res) =>{
	con.query("Select Clinician_1.FirstName,Clinician_1.MiddleName,Clinician_1.LastName,Clinician_1.PhoneNo,Clinician_2.Address from Clinician_1 inner join Clinician_2 on Clinician_1.docid = Clinician_2.docid",(err,rows,fields)=>{
		if(err) throw err;
		res.render('cspy',{data : rows});
	})
})

app.get('/aboutus',(req,res) =>{
	res.render('aboutus');
})

app.get('/GAD7',(req,res) =>{
	res.render('GAD7');
})

app.get('/PHQ9',(req,res) =>{
	res.render('PHQ9');
})

app.get('/SRQ',(req,res) =>{
	res.render('SRQ');
})

app.post('/PHQ9',(req,res) =>{
	var user = req.session.user;
	console.log(req.body.sc + "  "+req.body.sym)
	con.query("Update quiz set Test3Score = "+req.body.sc+" , symptom3 = '"+req.body.sym+"' where username = '"+user+"'",(err,rows,fields)=>{
		if(err) throw err;
	})
})

app.post('/GAD7',(req,res) =>{
	var user = req.session.user;
	console.log(req.body.sc + "  "+req.body.sym)
	con.query("Update quiz set Test2Score = "+req.body.sc+" , symptom2 = '"+req.body.sym+"' where username = '"+user+"'",(err,rows,fields)=>{
		if(err) throw err;
	})
})

app.post('/SRQ',(req,res) =>{
	var user = req.session.user;
	console.log(req.body.sc + "  "+req.body.sym)
	con.query("Update quiz set Test1Score = "+req.body.sc+" , symptom1 = '"+req.body.sym+"' where username = '"+user+"'",(err,rows,fields)=>{
		if(err) throw err;
	})
})

app.get('/task1',(req,res)=>{
	res.render('StressBust')
})

app.get('/task2',(req,res)=>{
	res.render('StressBust2')
})

app.get('/contactus',(req,res) =>{
	res.render('contactus');
})

app.get('/',function(req,res){
	req.session.destroy();
	res.render("login")
})

app.get('/mtest',(req,res)=>{
	res.render("mtest");
})

app.post('/mtest',(req,res)=>{
	var user = req.session.user;
	let sortable= [];
	for(var emot in req.body){
		sortable.push([emot,req.body[emot]]);
	}
	sortable.sort((a,b)=>{
		return a[1]-b[1];
	})
	con.query("Update quiz set MoodScore = '"+sortable[6][0]+"' where username = '"+user+"'",(err,rows,fields)=>{
		if(err) throw err;
	})
})

app.get('/home',(req,res)=>{
	var user = req.session.user;
	con.query("Select * from User inner join Quiz on User.Username = Quiz.Username where User.username = ?",[req.session.user],(err,rows,fields)=>{
		if(rows)
			res.render("home",{data : rows});
		else{
			var user1 = {FirstName : NULL,
					MoodScore : NULL,
					TestScore : NULL}
			res.render("home",{data:user1})
		}
	})	
})

app.post('/login',async (req,res)=>{
	var user = {
		"Email_id": req.body.em,
		"FirstName" : req.body.fn,
		"MiddleName" : req.body.mn,
		"LastName" : req.body.ln,
		"PhoneNo" : req.body.phn,
		"DOB" : req.body.dob,
		"Username" : req.body.un,
		"Password" :await bcrypt.hash(req.body.pw,10)
	};
	var query = "Insert into user set ? ";
	con.query(query,user,(err,rows,fields)=>{
		if(err) throw err;
		console.log("User created");
	})
	con.query("Insert into quiz (username) values ('"+req.body.un+"')",(err,rows,fields)=>{
		if(err) throw err;
		console.log("Entry done for quiz")
	})
})

app.post('/',async function(req,res){
	try{
		var email = req.body.ur;
		con.query("Select * from user where Username = ?",[email],(err,rows,fields)=>{
			if(err)	throw err;
			if(rows.length > 0){
				var pass = bcrypt.compareSync(req.body.pw,rows[0].Password);
				if(!pass){
					console.log("Invalid password please try again");
					res.redirect('/');
				}
				else{
					console.log("Succesful login");
					req.session.user = email;
					res.redirect('/home');
				}
			}
			else{
				console.log("Please signup to be a part of our community");
				res.redirect('/login');
			}
		});
	}
	catch(err){
		console.log(err);
		res.redirect('/');
	}
})

app.listen(port,function(){
	console.log("Server created to run on port "+port);
});