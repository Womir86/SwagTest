'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
const express= require("express");
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDoc=yamljs.load("./api.yaml");
const nodemon = require("nodemon");
const fileUpload = require("express-fileupload");
const dbConfig=require('./DATABASE/dbConf')
var util = require('util');
var hana = require('@sap/hana-client');

var connOptions = {

    serverNode: dbConfig.SERVERNODE,
    UID: dbConfig.UID,
    PWD: dbConfig.PWD,
    sslValidateCertificate: dbConfig.SSLVALIDATE,
};

var connection = hana.createConnection();



const port = process.env.port || 8080;
const app = express();

app.use(express.json()); //do POST jsony
app.use(fileUpload());
app.use(("/api"), swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));


const obj={id: 1, name: "Heniek", age: 22}

let users=[
    {id: 1, name: "Heniek",age: 22},
    {id: 2, name: "Mirek", age: 25},
    {id: 3, name: "Gośka", age: 61},
    {id: 4, name: "Hania", age: 32}

]

app.get("/string", (req, res) => {
    res.status(200).send("Działa, zwraca stringa TEST")
});

app.get("/user", (req, res) => {
    res.status(200).send(obj)
});


app.get("/users", (req, res) => {
    res.send(users)
});

app.get("/users/:id", (req, res) => {
    const obj = users.find((x) => x.id === parseInt(req.params.id)); 
    res.status(200).send(obj)
});

app.post("/create", (req, res) => {
    users=[req.body,...users]
    res.send(users)
});


app.get("/userQuery", (req, res) => {
    const obj = users.find((x) => x.id === parseInt(req.query.id)); 
    res.status(200).send(obj)
});


app.post("/upload", (req, res) => {
    const file= req.files.file 
    let path = __dirname +"/upload/"+"file_"+Date.now()+".jpg";
    file.mv(path, (err) =>{
        res.send("ok")
    })
    // res.status(200).send("OK")
});


app.delete("/deleteQuery", (req, res) => {
    users=users.filter(u => u.id !== parseInt(req.query.id));    
    res.status(200).send(users)
});

app.get("/carsHANA", (req, res) => {
    connection.connect(connOptions);
    var sql = 'SELECT * FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_CARS"';
    var result = connection.exec(sql);

connection.disconnect();
    res.send(result)
});


app.post("/createCarHana", (req, res) => {
       
    console.log(req.body)
    const obj=req.body;
    console.log(obj);
    connection.connect(connOptions);
    var insertBook= `INSERT INTO "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_CARS" VALUES(${req.body.ID},'${req.body.NAME}','${req.body.COLOR}','${req.body.BRAND}')`;
    console.log(insertBook);
    connection.exec(insertBook);
    
    var sql = 'SELECT  * FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_CARS"';
    var result = connection.exec(sql);
    
    connection.disconnect();
    
    res.send(result);
});


// app.get("/booksHANA", (req, res) => {
//     connection.connect(connOptions);
//     var sql = 'SELECT  * FROM "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK"';
//     var result = connection.exec(sql);

// connection.disconnect();
//     res.send(result)
// });


// app.post("/createBookHana", (req, res) => {
       
//     console.log(req.body)
//     const obj=req.body;
//     console.log(obj);
//     connection.connect(connOptions);
//     var insertBook= `INSERT INTO "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK" VALUES(${req.body.ID},'${req.body.NAME}','${req.body.AUTHOR}')`;
//     console.log(insertBook);
//     connection.exec(insertBook);
    
//     var sql = 'SELECT  * FROM "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK"';
//     var result = connection.exec(sql);
    
//     connection.disconnect();
    
//     res.send(result);
// });


app.delete("/deleteCarHana", (req, res) => {

    connection.connect(connOptions);
        
    var sql = `DELETE  FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_CARS" WHERE ID=${req.query.ID}`;
    var result = connection.exec(sql);
    
    connection.disconnect();
    
    res.send(`Usunięto indeks: ${req.query.ID}`);
    
});

app.get("/usersHANA", (req, res) => {
    connection.connect(connOptions);
    var sql = 'SELECT * FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON"';
    var result = connection.exec(sql);

connection.disconnect();
    res.send(result)
});


app.post("/createUserHana", (req, res) => {
       
    console.log(req.body)
    const obj=req.body;
    console.log(obj);
    connection.connect(connOptions);
    var insertBook= `INSERT INTO "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON" VALUES(${req.body.ID},'${req.body.NAME}','${req.body.CAR}')`;
    console.log(insertBook);
    connection.exec(insertBook);
    
    var sql = 'SELECT  * FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON"';
    var result = connection.exec(sql);
    
    connection.disconnect();
    
    res.send(result);
});



app.delete("/deleteUserHana", (req, res) => {

    connection.connect(connOptions);
        
    var sql = `DELETE  FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON" WHERE ID=${req.query.ID}`;
    var result = connection.exec(sql);
    
    connection.disconnect();
    
    res.send(`Usunięto indeks: ${req.query.ID}`);
    
});


app.post("/createCarPersonHana", (req, res) => {
       
    console.log(req.body)
    const obj=req.body;
    console.log(obj);
    connection.connect(connOptions);
    var insertCar= `INSERT INTO "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_CARS" VALUES(${req.body.Car.ID },'${req.body.Car.NAME}','${req.body.Car.COLOR}','${req.body.Car.BRAND}')`;
    console.log(insertCar);
    var insertPerson= `INSERT INTO "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON" VALUES(${req.body.Person.ID},'${req.body.Person.NAME}',${req.body.Person.CAR})`;
    console.log(insertPerson)
    // PALETYZACJACAP_CARS
    //console.log(insertBook);
    connection.exec(insertCar);
    connection.exec(insertPerson);
    
    var sql = 'SELECT  * FROM "803D1652C87A494BBEF8F75C987923C3"."PALETYZACJACAP_PERSON"';
    var result = connection.exec(sql);
    
    connection.disconnect();
    
    res.send(result);
});



app.listen(port, () => console.log(`The server is running on http://localhost:${port}/api`));
