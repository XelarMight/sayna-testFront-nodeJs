//constant variabl
var crypto = require('crypto');

/* MongoDb connection */
const {MongoClient} = require('mongodb');
// const uri = "http://localhost:27017";
// const uri = "mongodb://localhost:27017";
const uri = "mongodb+srv://john:john1234@cluster0.upvee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

var dbConnection;

//*
client.connect(function (err, db) {
    if (err || !db) {
      console.log(err);
      return err;
    }

    //getting db connections
    dbConnection = db.db("mydb");

    console.log("Successfully connected to MongoDB.");
});

//*/
//hash
function getHash256(text){
  let hash = crypto.createHash('sha256');
  let resultHash = hash.update(text, 'utf-8');
  return resultHash.digest('hex');
}

function findLogin(userLog){
  let tempResultLogin;
    promise1 = new Promise((resolve, reject) => {
      dbConnection
        .collection("users")
        .find(userLog)
        .toArray(function (err, result) {
          let callbackTempResult;
          if (err) {
            console.log("ERROR");
         } else {
            console.log("SUCCESS");
            //globalResult = result;
            // tempResultLogin = result;
            // console.log(result);
            callbackTempResult = result;
            //return by resolve
            resolve(callbackTempResult);
          }
        });
    });
    //console.log(tempResultLogin);
    return promise1;
}

function insertUser(userLog){
    dbConnection.collection("users").insert(userLog);
}

function addBankCard(users, cardId, cvc) {
  promise1 = new Promise((resolve, reject) => {
    dbConnection.collection("users").updateMany(users, { $set: {cvc: cvc, idCard: cardId} }, { upsert: true, multi: true });
    console.log(cardId, cvc, "ITO ARY EEE");
    resolve("is done");
  });
  return promise1;
}

module.exports={getHash256:getHash256, findLogin: findLogin, insertUser: insertUser,
  addBankCard: addBankCard};
