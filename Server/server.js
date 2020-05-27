// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('generate-key');
const moment = require('moment');

const app = express();

app.use(bodyParser.json());

let userThatLoggedIn = "";
let listName = "";
let specificTodo = "";

mongoose.connect('mongodb+srv://admin:admin@cluster0-6joz4.mongodb.net/trello?retryWrites=true&w=majority', err => {
  if (err) console.log("could'nt login to DB", err);
  console.log('Connected to DB');
})

let cardNameSchema = mongoose.Schema({
  _id: String,
  username: String,
  card: String
});

let todoSchema = mongoose.Schema({
  _id: String,
  value: String,
  list: String,
  description: String,
  username: String,
  time: String
});

let CardName = mongoose.model('cardName', cardNameSchema);
let Todo = mongoose.model('todo', todoSchema);

// Login stuff
app.get('/login', (req, res) => { // check
  res.send(userThatLoggedIn);
});

app.post('/login', (req, res) => {  // check
  let username = req.body
  if (!username) {
    res.status(400);
    res.json({ error: 'url is not right!' })
  }
  else {
    userThatLoggedIn = username.username;
    res.json(username);
  }
});

// Add card stuff
app.get('/addcard', (req, res) => { // check
  CardName.find({ username: userThatLoggedIn }, (err, data) => {
    if (err) throw err;
    console.log('sending cards to frontEnd...');
    res.send(data);
  })
});

app.post('/addcard', (req, res) => {  // check
  let card = req.body;
  console.log(card)
  if (!card.card) {
    res.status(400);
    res.json({ error: 'Bad request or did not find card' });
  }
  else {
    userThatLoggedIn = card.username;
    let cardName = new CardName({
      _id: keys.generateKey(),
      username: card.username,
      card: card.card
    });

    cardName.save(err => {
      if (err) console.log("Can't save card name:", err);
      res.json(card);
    });
  };
});

app.post('/addtodo', (req, res) => {  // check
  let todo = req.body;
  if (!todo.data) {
    res.status(400);
    res.json({ error: "Can't get todos from frontend or no value!" });
  }
  else {
    listName = todo.list;
    console.log(listName)

    let myTodo = new Todo({
      _id: keys.generateKey(),
      value: todo.data,
      list: todo.list,
      description: "",
      username: userThatLoggedIn,
      time: moment().format('LLLL')
    });

    myTodo.save(err => {
      if (err) console.log("Can't save todos to DB!!!");
      res.json(todo);
    });
  }
});

// Hämtar specifik
app.get('/addtodoinfo', (req, res) => { // check
  Todo.find({ value: specificTodo }, (err, data) => {
    if (err) throw err;
    console.log('Sending todos to frontEnd...');
    res.send(data);
  });
});

app.post('/addtodoinfo', (req, res) => {  // check
  let value = req.body;

  if (!value.value) {
    res.status(400);
    res.json({ error: "Can't get specific todo from frontend or no value!" });
  }
  else {
    specificTodo = value.value;
    res.json(value);
  }
});

app.put('/addtodoinfo/:id', (req, res) => { // check
  let id = req.params.id;
  let data = req.body;
  console.log('detta är idet!: ', id);
  // console.log('detta är data edit:', data.description)

  if (!id) {
    res.status(400);
    res.json({ error: "Can't edit card!" });
    res.end();
    return;
  }

  if (!data) {
    res.status(400);
    res.json({ error: "Can't get the edited info!" });
    res.end();
    return;
  }
  else {
    res.send(data);
    console.log('detta är data list!!!!!!!!!:', data.list)
    Todo.findByIdAndUpdate(data._id,
      {
        _id: data._id,
        value: data.value,
        list: data.list,
        description: data.description,
        time: data.time
      }, err => {
        if (err) console.log('cant update values', err);
        console.log('updated values successfully');
      });
  }
});

app.get('/gettodos', (req, res) => {  // check
  Todo.find({ username: userThatLoggedIn }, (err, data) => {
    if (err) throw err;
    console.log('sending todos to frontEnd like comDidMount');
    res.send(data);
  });
});

app.delete('/deletetodos/:id', (req, res) => {
  let id = req.params.id;
  console.log('this is todo id: ', id);
  if (id) {
    Todo.findByIdAndDelete(id, err => {
      if (err) console.log('can not delete todo from DB...');
      console.log('Todo deleted successfully');
      res.status(204);
      res.end();
    });
  }
});

app.delete('/deletecards/:id', (req, res) => {
  let cardName = req.params.id;

  if (cardName) {
    CardName.deleteMany({ card: cardName }, err => {
      if (err) console.log('could not delete card from DB: ', err);
      console.log('Card Deleted successfully');
      res.status(204);
      res.end();
    });

    Todo.deleteMany({ list: cardName }, err => {
      if (err) console.log('could not delete all todos from cardname from DB...');
      console.log(`All Todos inside card: ${cardName} where successfully deleted`);
      res.status(204);
      res.end();
    });
  }
});


const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});