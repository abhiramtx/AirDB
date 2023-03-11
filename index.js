const express = require('express')
const path = require('path');
const fs = require("fs");
const crypto = require("crypto");
const app = express();
const port = 8000
const date = new Date();
app.use(express.json())
app.enable('trust proxy', true)

// API      
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
})

app.get('/:username/:id/:pass/getValue/:key', (req, res) => {
  // get value of key
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})
    
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send(JSON.stringify(file['fullData'][req.params.username]['databases'][req.params.id]['keys'][req.params.key]['value']))
  }
  else {
    res.send("DB authentication failed.")
  }
})

app.get('/:username/:id/:pass/setValue/:key/:value', (req, res) => {
  // set key value
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})
    
    file['fullData'][req.params.username]['databases'][req.params.id]['keys'][req.params.key]['value'] = req.params.value;
    file['fullData'][req.params.username]['databases'][req.params.id]['versions'].push(file['fullData'][req.params.username]['databases'][req.params.id]['keys'])
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send("Set value.");
  }
  else {
    res.send("DB authentication failed.");
  }
})

/* app.get('/:username/:id/:pass/retrieveFullDB', (req, res) => {
   return full db value
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    res.send(JSON.stringify(file['fullData'][req.params.username]['databases'][req.params.id]));
  }
  else {
    res.send("DB authentication failed.");
  }
}) */

app.get('/:username/:id/:pass/retrieveDB', (req, res) => {
  // return key values
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})

    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send(JSON.stringify(file['fullData'][req.params.username]['databases'][req.params.id]['keys']));
  }
  else {
    res.send("DB authentication failed.");
  }
})

app.get('/:username/:id/:pass/createKey/:key/:value?', (req, res) => {
  // make new key with value of 0
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})
    
    file['fullData'][req.params.username]['databases'][req.params.id]['keys'][req.params.key] = {"value": 0};
    if (req.params.value != "undefined") {
      file['fullData'][req.params.username]['databases'][req.params.id]['keys'][req.params.key]['value'] = req.params.value;
    }
    file['fullData'][req.params.username]['databases'][req.params.id]['versions'].push(file['fullData'][req.params.username]['databases'][req.params.id]['keys'])
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send("Created key.");
  }
  else {
    res.send("DB authentication failed.");
  }
})

app.get('/:username/:id/:pass/deleteKey/:key', (req, res) => {
  // delete key
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})
    
    delete file['fullData'][req.params.username]['databases'][req.params.id]['keys'][req.params.key];
    file['fullData'][req.params.username]['databases'][req.params.id]['versions'].push(file['fullData'][req.params.username]['databases'][req.params.id]['keys'])
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send("Deleted key.");
  }
  else {
    res.send("DB authentication failed.");
  }
})

app.get('/:username/:id/:pass/version/:ver', (req, res) => {
  // get version
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  if (req.params.pass == file['fullData'][req.params.username]['databases'][req.params.id]['password']) {
    let day = (new Date()).getDate();
    let month = (new Date()).getMonth() + 1;
    let year = (new Date()).getFullYear();
    let date = `${month}/${day}/${year}`
    file['fullData'][req.params.username]['databases'][req.params.id]['requests'].push({"ip": req.ip, "time": date})

    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send(JSON.stringify(file['fullData'][req.params.username]['databases'][req.params.id]['versions'][(parseInt(req.params.ver))-1]));
  }
  else {
    res.send("DB authentication failed.");
  }
})

// Application functions
app.post('/login', (req, res) => {
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  const users = Object.keys(file['fullData']);
  if (!users.includes(req.body.username)) {
    res.send('wrongCreds');
    return
  }
  const hash = sha(req.body.password);
  if (getHashesPassword(req.body.username) == hash) {
    res.send('correctCreds');
    return
  }
  else {
    res.send('wrongCreds');
  }
})

app.post('/signup', (req, res) => {
  if (req.body.username.length <= 15) {
    const file = JSON.parse(fs.readFileSync("./data/data.json"));
    const users = Object.keys(file['fullData']);
    if (users.includes(req.body.username)) {
      res.send('usernameExists');
      return
    }
    else {
      file['fullData'][req.body.username] = {"password": sha(req.body.password), "databases": {}}
      fs.writeFileSync("./data/data.json", JSON.stringify(file));
      res.send('createdAccount')
    }
  }
  else {
    res.send('usernameTooLong');
  }
})

app.post('/createDb', (req, res) => {
  if (validate(req.body.validateData.username, req.body.validateData.password)) {
    let databases = Object.keys(getDatabases(req.body.validateData.username));
    if (databases.includes(req.body.payload.dbName)) {
      res.send("databaseExists");
      return
    }
    const file = JSON.parse(fs.readFileSync("./data/data.json"));
    const url = `https://airdb.abhiramtx.repl.co/${req.body.validateData.username}/${req.body.payload.dbName}/${req.body.payload.dbPass}/`
    file['fullData'][req.body.validateData.username]['databases'][req.body.payload.dbName] = {"password": req.body.payload.dbPass, "keys": {"DEFAULT_KEY": {"value": 0}}, "versions": [], "requests": [], "lastRefresh": (new Date()).getTime(), "url": url}
    file['fullData'][req.body.validateData.username]['databases'][req.body.payload.dbName]['versions'].push(file['fullData'][req.body.validateData.username]['databases'][req.body.payload.dbName]['keys'])
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send("databaseCreated")
  }
})

app.post('/getData', (req, res) => {
  if (validate(req.body.validateData.username, req.body.validateData.password)) {
    const file = JSON.parse(fs.readFileSync("./data/data.json"));
    let data = file['fullData'][req.body.validateData.username]['databases'];
    res.send(data);
  }
})

app.post('/replaceDbValue', (req, res) => {
  if (validate(req.body.validateData.username, req.body.validateData.password)) {
    try {
      const file = JSON.parse(fs.readFileSync("./data/data.json"));
      file['fullData'][req.body.validateData.username]['databases'][req.body.payload.id]['keys'] = JSON.parse(req.body.payload.replace);
      file['fullData'][req.body.validateData.username]['databases'][req.body.payload.id]['versions'].push(file['fullData'][req.body.validateData.username]['databases'][req.body.payload.id]['keys'])
      fs.writeFileSync("./data/data.json", JSON.stringify(file));
      res.send("updatedKeys")
    } catch(error) {
      res.send(error)
    }
  }
})

app.post('/deleteDB', (req, res) => {
  if (validate(req.body.validateData.username, req.body.validateData.password)) {
    const file = JSON.parse(fs.readFileSync("./data/data.json"));
    delete file['fullData'][req.body.validateData.username]['databases'][req.body.payload.id];
    fs.writeFileSync("./data/data.json", JSON.stringify(file));
    res.send("deletedDb")
  }
})

app.listen(port, () => {
  console.log(`On port ${port}`)
})

// Functions
function sha(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function getHashesPassword(username) {
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  const data = file['fullData']
  return data[username]["password"]
}

function getDatabases(username) {
  const file = JSON.parse(fs.readFileSync("./data/data.json"));
  const data = file['fullData']
  return data[username]["databases"]
}

function validate(username, password) {
  const pass = sha(password);
  if (getHashesPassword(username) == pass) {
    return true
  }
  else {
    return false
  }
}