var express = require("express");
var app = express();
var alert = require("alert");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
const request = require("request");
var serviceAccount = require("./serviceAccountKey.json");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp({
     credential: cert(serviceAccount),
});

const path = require("path");
const { futimes } = require("fs");
const port = process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, "public")));

const db = getFirestore();

app.get('/', function (req, res) {
    console.log(__dirname)
    res.sendFile(__dirname + "/main.html")
})

app.get("/login_Page", function(req, res) {
    console.log(__dirname)
    res.sendFile(__dirname + "/login_Page.html")
})

app.get("/loginsubmit", function(req, res) {
    var email = req.query.email
    var password = req.query.password
    db.collection("registration")
    .where("email", "==", email)
    .where("password", "==", password)
    .get()
    .then((docs) => {
         if(docs.size > 0){
             res.sendFile(__dirname + "/main.html")
            }
         else{
             res.sendFile(__dirname + "/login_fail.html");
            }
    });
});

app.get("/signup", function(req, res) {
    console.log(__dirname)
     res.sendFile(__dirname + "/signup.html")
})

app.get("/Signupsubmit", function(req, res) {
    console.log(req.query.Fname)
    console.log(req.query.Lname)
    console.log(req.query.mail)
    console.log(req.query.phone)
    console.log(req.query.password)
    db.collection("registration")
    .add({
        First: req.query.name,
        email: req.query.mail,
        password: req.query.password,
    })
    .then(() =>{
       res.sendFile(__dirname + "/main.html")
    })
})

app.listen(3000, function () { 
    console.log('Example app listening on port 3000!')
}); 
