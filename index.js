const express = require("express");
const server = express();
server.use(express.json());

// -> MIDDLEWARE 1
server.use((req, res, next) => {
  console.time("Duração da Request");
  console.log(`Método HTTP: ${req.method}; URL: ${req.url}`);
  next();
  console.timeEnd("Duração da Request");
});

// -> MIDDLEWARE 2
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res
      .status(400)
      .json({ error: "Nome de usuário não foi encontrado" });
  }
  return next();
}

// -> MIDDLEWARE 3
function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "Não existe esse usuário" });
  }
  return next();
}

// -> MIDDLEWARE 4
function insertVariableInRequest(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "Não existe esse usuário" });
  }
  //caso existir usuario preenche dentro do req uma nova variavel global
  req.user = user;
  return next();
}

// -> Vetor
const users = ["Marlon", "Denis"];

// -> Rotas
// Index
server.get("/users", (req, res) => {
  return res.json(users);
});

// Show
server.get("/users/:index", insertVariableInRequest, (req, res) => {
  return res.json(req.user);
});

// Create
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

// Edit
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const posicaoIndex = req.params.index;
  const { name } = req.body;
  users[posicaoIndex] = name;
  res.json(users);
});

// Delete
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const posicaoIndex = req.params.index;
  // percorre o vetor, e na posicao fornecida ele recorta 1 posicao
  users.splice(posicaoIndex, 1);
  return res.send("Deletado");
});

// -> Porta
server.listen("3333");
