'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs')

const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRounds=10;

const PORT = 3012;
const HOST = '0.0.0.0';
const app = express();


const cors = require('cors');
app.use(cors({origin: ['http://127.0.0.0:3012']
    
}));




app.use(express.json());


 var mysql = require('mysql');
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');
 var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Happy^12345',
  database: 'projectvvv'
}); 

con.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
  
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 2,
    },
}))

app.post('/registerstaff', (req, res)=> {
    console.log("Get ready for posting");
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);


    bcrypt.hash(password, saltRounds, (err, hash)=>{

        if (err){
            console.log(err);
        }

        var sql_ = "INSERT INTO staffmembers(name, username, password) VALUES('"+name+"', '"+username+"', '"+hash+"')";
        con.query(sql_, function(err, result_){
            console.log("Creating an account");
            if (err){
                console.log("error");
            
            }
        
    })
    })


    
})




app.post('/registeradmin', (req, res)=> {
    console.log("Get ready for posting");
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);


    bcrypt.hash(password, saltRounds, (err, hash)=>{

        if (err){
            console.log(err);
        }

        var sql_ = "INSERT INTO admindata(name, username, password) VALUES('"+name+"', '"+username+"', '"+hash+"')";
        con.query(sql_, function(err, result_){
            console.log("Creating an account");
            if (err){
                console.log(err);
            
            }

    })
    })


    
})


app.post('/login', (req, res)=> {
    var username = req.body.username;
    var password = req.body.password;
    
    con.query("SELECT * from staffmembers WHERE username=?;", username, function(err, result){
        console.log('Getting the values');
        
        if (err) {
            throw err;
        }
        else{

            if (result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response)=>{
                    if (response){
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    } else{
                        res.send("Wrong combination.")
                    }
                })
            }
            else{
                res.send({message: "User does not exist"});
            }
            
        }
    })
})


app.post('/adminlogin', (req, res)=> {
    var username = req.body.username;
    var password = req.body.password;
   
    con.query("SELECT * from admindata WHERE username=?;", username, function(err, result){
        console.log('Getting the values');
        
        if (err) {
            throw err;
        }
        else{

            if (result.length > 0){
                bcrypt.compare(password, result[0].password, (error, response)=>{
                    if (response){
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result);
                    } else{
                        res.send("Wrong combination.")
                    }
                })
            }
            else{
                res.send({message: "User does not exist"});
            }
            
        }
    })
})


app.delete('/deletestaff/:username', (req, res)=>{
    var username = req.params.username;
   
    var sql = "DELETE FROM staffmembers WHERE username='"+username+"'";
    con.query(sql, function(err, result){
        if (err){
            throw err; 
        }
        else{
            console.log(result);
            res.send(result);
        }
        
    })
})




app.put('/updatestaff/:username', (req, res)=>{
    console.log(req.body);
    var username = req.params.username;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;

    console.log("Changing password");

    var sql = "UPDATE staffmembers SET password = '"+newpassword+"' WHERE username='"+username+"' AND password='"+oldpassword+"'";
    console.log("Reaching after sql");
    con.query(sql, function(err, result){
        console.log("Reaching after query req");
        if (err){
            console.log(err);
            throw err;
        }
        else{
           console.log(result);
            res.send(result);
        }
    })


})



app.post('/registeradmin', (req, res)=> {
    console.log("Get ready for posting");
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    console.log(req.body);


    var sql_ = "INSERT INTO admindata(name, username, password) VALUES('"+name+"', '"+username+"', '"+password+"')";
    con.query(sql_, function(err, result_){
        console.log("Creating an account");
        if (err){
            console.log("error");
            
        }
        else{
            
            res.send("Account created");
        }
    })


})



app.post('/addcustomer', (req, res)=>{ 
    var id = req.body.id;
    var name = req.body.name;
    var report = req.body.report;

    var sql_ = "INSERT INTO customers(id, name, report) VALUES('"+id+"', '"+name+"', '"+report+"')";
    con.query(sql_, function(err, result){
        if (err){
            throw err;
        }
        else{
            res.send(result);
        }
    })
})

app.delete('/removecustomer/:id', (req, res)=>{
    var id = req.params.id;
   
    var sql = "DELETE FROM customers WHERE id='"+id+"'";
    con.query(sql, function(err, result){
        if (err){
            throw err; 
        }
        else{
            console.log(result);
            res.send(result);
        }
        
    })
})

app.put('/updatecustomer/:id', (req, res)=>{
    const id = req.params.id;
    const report = req.body.report;
    var sql = "UPDATE customers SET report = '"+report+"' WHERE id='"+id+"'";

    con.query(sql, function(err, result){
        if (err){
            throw err;
        }
        else{
            res.send(result);
        }
    })

})



app.post('/addreport', (req, res)=>{
    var trackingid=req.body.trackingid;
    var report=req.body.report;

    var sql = "INSERT INTO reportdata(trackingid, report) VALUES('"+trackingid+"', '"+report+"')";
    con.query(sql, function(err, result){
        if (err){
            throw err;
        }
        else{
            console.log(result);
            res.send("Report added successfully");
        }
    })
})


app.get('/getcustomerdata', (req, res)=>{
    var sql = 'SELECT * FROM customers';
    con.query(sql, function(err, result){
       if(err) {
           throw err;
       }
       else{
            res.send(result);
       } 
    })
})

app.get('/getstaffdata', (req, res)=>{
    var sql = 'SELECT * FROM staffmembers';
    con.query(sql, function(err, result){
       if(err) {
           throw err;
       }
       else{
            res.send(result);
       } 
    })
})




app.listen(PORT);
console.log('up and running');