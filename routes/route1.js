const express = require("express");
const router = express.Router();
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDoc=yamljs.load("./api.yaml");

router.use(("/api"), swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

const obj={id: 1, name: "Heniek", age: 22}

let users=[
    {id: 1, name: "Heniek",age: 22},
    {id: 2, name: "Mirek", age: 25},
    {id: 3, name: "Gośka", age: 61},
    {id: 4, name: "Hania", age: 32}

]

router.get("/string", (req, res) => {
    res.status(200).send("Działa, zwraca stringa TEST")
});

router.get("/user", (req, res) => {
    res.status(200).send(obj)
});


router.get("/users", (req, res) => {
    res.send(users)
});

router.get("/users/:id", (req, res) => {
    const obj = users.find((x) => x.id === parseInt(req.params.id)); 
    res.status(200).send(obj)
});

router.post("/create", (req, res) => {
    users=[req.body,...users]
    res.send(users)
});


router.get("/userQuery", (req, res) => {
    const obj = users.find((x) => x.id === parseInt(req.query.id)); 
    res.status(200).send(obj)
});


router.post("/upload", (req, res) => {
    const file= req.files.file 
    let path = __dirname +"../upload/"+"file_"+Date.now()+".jpg";
    file.mv(path, (err) =>{
        res.send("ok")
    })
    // res.status(200).send("OK")
});


router.delete("/deleteQuery", (req, res) => {
    users=users.filter(u => u.id !== parseInt(req.query.id));    
    res.status(200).send(users)
});
