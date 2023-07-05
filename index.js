'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
const express= require("express");
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDoc=yamljs.load("./api.yaml");
const nodemon = require("nodemon");
const fileUpload = require("express-fileupload");
var util = require('util');
var hana = require('@sap/hana-client');

var connOptions = {

    serverNode: '995f02a7-dd27-4f42-a691-4365ed7e8437.hana.trial-us10.hanacloud.ondemand.com:443',
    UID: 'B3AC1289F06A4E55ACBD4D49B0691B65_7II3ZXD1WZ2ORSY77J7MC647F_RT',
    PWD: 'Va4512zmUT8wAceSN7ETBS8jEU.x3OzTaPfI1rUYGYDPUvfMSyK3eSAjXPcQq5nAeqzI-l029RcGrZTs7t_aY8jdpsavS5D061nzQu7zEF6vlS-qH0cAnSGJd8hDTN.M',
    sslValidateCertificate: 'false',
};

var connection = hana.createConnection();
// connection.connect(connOptions);

// var sql = 'SELECT top 1 * FROM "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK"';
// // var sql = 'SET @json = (SSELECT "ID", "NAME" FROM "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK" FOR JSON PATH)';
// //var t0 = performance.now();
// var result = connection.exec(sql);

// //console.log(util.inspect(result, { colors: false }));
// //console.log(users)
// //var t1 = performance.now();
// //console.log("time in ms " +  (t1 - t0));
// connection.disconnect();


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

app.get("/booksHANA", (req, res) => {
    connection.connect(connOptions);
    var sql = 'SELECT  * FROM "B3AC1289F06A4E55ACBD4D49B0691B65"."WOMIRCRUDVC_BOOK"';
    var result = connection.exec(sql);

connection.disconnect();
    res.send(result)
});


app.listen(port, () => console.log(`The server is running on http://localhost:${port}/api`));
