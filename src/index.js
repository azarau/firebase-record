const express = require("express");
var faker = require("faker");
const app = express();
const port = 8080;

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyBUfHsP0thPtdGFTiXYGGPGPTPODUcp_yA",
  authDomain: "azara-u.firebaseapp.com",
  databaseURL: "https://azara-u.firebaseio.com",
  projectId: "azara-u",
  storageBucket: "azara-u.appspot.com",
  messagingSenderId: "96706318508",
  appId: "1:96706318508:web:c8cc1f8370dbd079030f09",
  measurementId: "G-ZVJFZXPBZB"
});
var db = firebase.firestore();

app.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    var data = [];
    snapshot.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());
      data.push(doc.data());
      //res.json(doc.data())
    });
    res.json(data);
  } catch (error) {
    console.log("Error getting document:", error);
  }

  return res.send("test");
});

app.get("/page1", async (req, res) => {
  for (var i = 1; i <= 10; i++) {
    const rs = await db.collection("_users").add({
      name: faker.name.findName(),
      age: faker.datatype.number({ min: 18, max: 30 }),
      gender: faker.random.arrayElement(["male", "female"])
    });

    console.log("Added document with ID: ", rs.id);
  }
  res.send("Record Added!");
});

app.get("/page2", async (req, res) => {
  let data = [];
  const citiesRef = db.collection("_users");
  const snapshot = await citiesRef.orderBy("name").limit(3).get();
  snapshot.forEach((doc) => {
    // console.log(doc.id, "=>", doc.data());
    data.push(doc.data());
  });

  console.log(data);
  res.send("this is page2");
});

app.get("/table", async (req, res) => {
  let obj = { 1: "one", 2: "two", 3: "three" };

  let result = "<table border='1'>";

  result += "<tr><td>SN</td><td>NAME</td><td>AGE</td></tr>";

  let data = [];
  const citiesRef = db.collection("_users");
  const snapshot = await citiesRef.orderBy("name").limit(20).get();

  var i = 1;
  snapshot.forEach((doc) => {
    var data = doc.data();
    // console.log(doc.id, "=>", doc.data());
    result +=
      "<tr><td>" +
      i +
      "</td><td>" +
      data.name +
      "</td><td>" +
      data.age +
      "</td></tr>";
    i++;
  });

  result += "</table>";

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
