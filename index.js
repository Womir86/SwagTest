const express= require("express");
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerJsDoc=yamljs.load("./api.yaml");
const nodemon = require("nodemon");

const port = process.env.port || 4000;
const app = express()
app.use(("/api"), swaggerUI.serve, swaggerUI.setup(swaggerJsDoc));

app.get("/string", (req, res) => {
    res.status(200).send("Działa, zwraca stringa TEST")
})

const obj={id: 1, name: "Heniek", age: 22}

let users=[
    {id: 1, name: "Heniek", age: 22},
    {id: 2, name: "Mirek", age: 23},
    {id: 3, name: "Gośka", age: 36},
    {id: 4, name: "Hania", age: 19}

]

app.get("/user", (req, res) => {
    res.status(200).send(obj)
})


app.use("/users", (req, res) => {
    res.send(users)
})

app.listen(port, () => console.log(`The server is running on http://localhost:${port}/api`));





