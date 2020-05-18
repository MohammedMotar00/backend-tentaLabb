// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('generate-key');

const app = express();

app.use(bodyParser.json());

let userThatLoggedIn = "";

mongoose.connect('mongodb+srv://admin:admin@cluster0-6joz4.mongodb.net/trello?retryWrites=true&w=majority', err => {
  if (err) console.log("could'nt login to DB", err);
  console.log('Connected to DB');
})

let cardNameSchema = mongoose.Schema({
  _id: String,
  username: String,
  card: String
});

let CardName = mongoose.model('cardName', cardNameSchema);

// Login stuff
app.get('/login', (req, res) => {
  res.send(userThatLoggedIn);
});

app.post('/login', (req, res) => {
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
app.get('/addcard', (req, res) => {
  CardName.find({ username: userThatLoggedIn }, (err, data) => {
    if (err) throw err;
    console.log('sending cards to frontEnd...');
    res.send(data);
  })
});

app.post('/addcard', (req, res) => {
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


const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});