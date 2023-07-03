const express= require("express");
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDoc=yamljs.load("./api.yaml");
const nodemon = require("nodemon");


const port = process.env.port || 8080;
const app = express();

app.use(express.json);
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
app.get("/create", (req, res) => {
    users=[req.body,...users]
    res.send(users)
});


app.listen(port, () => console.log(`The server is running on http://localhost:${port}/api`));
