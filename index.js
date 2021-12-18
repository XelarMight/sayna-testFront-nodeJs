var http = require('http');
var express = require('express');
var crypto = require('crypto');
var app = express();
var Promise = require('promise');
var modelAdapter = require('./ModelAdapter.js');
app.use(express.json());
app.use(express.urlencoded());

var globalResult;
// console.log("Successfully connected to MongoDB.");

class User {
  constructor(firstname, lastname, email, sexe, password, date_naissance) {
  this.firstname = firstname;
	this.lastname = lastname;
	this.email = email;
	this.sexe = sexe;
	this.password = password;
	this.date_naissance = date_naissance;
  }
}

app.get('/', function(req, res){
  res.send({'hello': 'accueil', 'hello1': 'accueil'});
})

/** test **/
app.get('/liste_data', function(req, res){
  res.send({'hello': 'hey', 'hello1': 'hey'});
})

app.get('/liste_user', function(req, res){
  res.send(globalResult);
})

app.post('/new_data', function(req, res){
  res.send({'post': 'who knows', 'hello1': 'hey'});
})

/** fin test **/

/** fonctionnalités **/
app.post('/login', function(req, res) {
  let usr = req.body.email;
  let password = req.body.password;

  let hashedPassword = modelAdapter.getHash256(password);

  console.log(usr, password, hashedPassword.toUpperCase());

  //si mot de passe ou identifiant vide
  if(usr == '' || password == ''){
    res.send({ error: true, message: "Email/password manquants"});
  }

  //verification identifiant
  modelAdapter.findLogin({email: usr, password: hashedPassword.toUpperCase()}).then(function(result){
    // console.log('Hello user found: ', result);
    if(result.length > 0){
      res.send({
        	error: false,
        	message: "L'utilisateur a été authentifié avec succès",
        	user: {
        		firstname: result[0].firstname,
        		lastname: result[0].lastname,
        		email: result[0].email,
        		sexe: result[0].sexe,
        		dateNaissance: result[0].dateNaissance,
        		createdAt: result[0].createdAt,
        		updateAt: result[0].updateAt
        	},
        	access_token: "xxxxxx",
        	refresh_token: "xxxxxx"
        });
    }else{
      res.send({ error: true, message: "Email/password incorrect"});
    }
  });
})

app.post('/register', function(req, res){

  let hashedPassword = modelAdapter.getHash256(req.body.password);
  let tempUser = new User(req.body.firstname, req.body.lastname, req.body.email,
        req.body.sexe, hashedPassword, req.body.dateNaissance);
  modelAdapter.insertUser(tempUser);
  res.send({'post': 'inserter', 'success': '200 OK'});
})

/** fin fonctionnalités **/

/** creation serveur **/
var server = app.listen(process.env.PORT || 80, function(){
  var host = server.address().address;
  var port = server.address().port;
})

// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World!');
// }).listen(8082);

/** fin creation serveur **/
