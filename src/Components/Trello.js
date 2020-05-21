import React, { Component } from 'react'
import axios from 'axios';
import qs from 'query-string';
import AddTodo from './AddTodo';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';

class Trello extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      username: "",

      card: '',
      removeValueCard: '',
      myCards: [],

      getTodosDB: [],
      showModal: false,

      listValue: "",
      todoValue: "",
      description: "",
      lastChanged: "",
      cardID: "",

      removeListValue: "",
      removeTodoValue: "",
      removeDescriptionValue: ""

      // todo: "",
      // removeValueTodo: "",
      // todos: []
    }
  }

  componentDidMount() {
    const { username } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    });

    axios
      .post('/login', {username: username}, {headers: {"Content-Type": "application/json"}})
      .then(res => {
        console.log(res);
      });

    axios('/login')
      .then(res => {
        console.log(res.data);
        this.setState({ username: res.data });
      });

    // Hämtar korten
    axios('/addcard')
      .then(res => {
        console.log(res.data);
        res.data.map(card => {
          console.log(card.card)
        })
        this.setState({ myCards: res.data });
      });

    // get all todos for specific cards!
    console.log(this.state.myCards)
    axios('/gettodos')
      .then(res => {
        console.log(res);
        this.setState({ getTodosDB: res.data });
      })
  }

  componentDidUpdate() {
    console.log(this.state.getTodosDB);
  }

  // Adding card
  setCard = (e) => {
    this.setState({ card: e.target.value });
  };

  addCard = (e) => {
    e.preventDefault();
    const { username } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true
    });

    this.setState({ removeValueCard: this.state.card, card: '' });

    axios
      .post('/addcard',
        {
          username: username,
          card: this.state.card
        },
        {
          headers: { "Content-Type": "application/json" }
        })
      .then(res => {
        console.log(res);
        // Hämtar korten
        axios('/addcard')
        .then(res => {
          console.log(res.data);
          res.data.map(card => {
            console.log(card.card)
          })
          this.setState({ myCards: res.data });
        });
      })
  };

  setDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  setListValue = (e) => {
    this.setState({ listValue: e.target.value });
  };

  setTodoValue = (e) => {
    this.setState({ todoValue: e.target.value });
  };

  // Modal stuff
  handleModal = (value) => {
    console.log(value);
    this.setState({ showModal: !this.state.showModal });

    axios
      .post('/addtodoinfo', { value: value }, { headers: { "Content-Type": "application/json" } })
    .then(res => {
      console.log(res);
    });

    axios('/addtodoinfo')
      .then(res => {
        console.log(res.data[0]);
        this.setState({ description: res.data[0].description });
        this.setState({ listValue: res.data[0].list });
        this.setState({ todoValue: res.data[0].value });
        this.setState({ lastChanged: res.data[0].time });
        this.setState({ cardID: res.data[0]._id });
      });
  };

  moveTodos = (todo) => {
    console.log('myTodos: ', todo);
    console.log('myTodos id: ', this.state.cardID);
    this.setState({ showModal: false });
    // axios
    //   .put('/addtodoinfo', { value: todo }, { headers: { "Content-Type": "application/json" } })
    // .then(res => {
    //   console.log(res);
    // });
    axios
      .put(`/addtodoinfo/${this.state.cardID}`,
      {
        _id: this.state.cardID,
        description: this.state.description,
        list: todo,
        time: moment().format('LLLL'),
        value: this.state.todoValue,
      },
      {headers: {"Content-Type": "application/json"}})
      .then(res => {
        console.log(res);
        // get all todos for specific cards!
        console.log(this.state.myCards)
        axios('/gettodos')
          .then(res => {
            console.log(res);
            this.setState({ getTodosDB: res.data });
          })
      });
  }

  getAddingTodos = () => {
    // get all todos for specific cards!
    console.log(this.state.myCards)
    axios('/gettodos')
      .then(res => {
        console.log(res);
        this.setState({ getTodosDB: res.data });
      })
  }

  saveChanges = (e) => {
    e.preventDefault();
    this.setState({ showModal: false });
    this.setState({ removeDescriptionValue: this.state.description, description: "" });

    axios
      .put(`/addtodoinfo/${this.state.cardID}`,
      {
        _id: this.state.cardID,
        description: this.state.description,
        list: this.state.listValue,
        time: moment().format('LLLL'),
        value: this.state.todoValue,
      },
      {headers: {"Content-Type": "application/json"}})
      .then(res => {
        console.log(res);
        // get all todos for specific cards!
        console.log(this.state.myCards)
        axios('/gettodos')
          .then(res => {
            console.log(res);
            this.setState({ getTodosDB: res.data });
          })
      });
  };

  deleteTodo = (id) => {
    console.log('idet: ', id);

    axios
      .delete(`/deletetodos/${id}`)
    .then(res => {
      console.log('delete todos: ', res);
      // get all todos for specific cards!
      axios('/gettodos')
        .then(res => {
          console.log(res);
          this.setState({ getTodosDB: res.data });
        })
    });
  };

  deleteCards = (cardName) => {
    console.log('cardName: ', cardName);

    axios
      .delete(`deletecards/${cardName}`)
    .then(res => {
      console.log('delete cards: ', res);
      // Hämtar korten
      axios('/addcard')
      .then(res => {
        console.log(res.data);
        res.data.map(card => {
          console.log(card.card)
        })
        this.setState({ myCards: res.data });
      });
    });
  };

  // // Adding todos
  // setTodo = (e) => {
  //   this.setState({ todo: e.target.value });
  // }

  // addTodo = (name) => {
  //   console.log(name);
  // };

  render() {
    const { card, username, myCards, todo, todos, getTodosDB, showModal, listValue, todoValue, description, lastChanged } = this.state;

    // let allCards = myCards.map(card => {
    //   return <p>{card.card}</p>
    // })

    return (
      <div>
        <div>
          <h1>Welcome to Motar Trello!</h1>
          <h3>Username: {username}</h3>
        </div>
        <div>
          <form onSubmit={this.addCard.bind(this)}>
            <input 
              type="text"
              value={card}
              onChange={this.setCard.bind(this)}
            />
            <button type="submit">Add list</button>
          </form>
        </div>

        <div>
          {myCards.map(card => {
            // let allCards = card.card;

            return(
              <div style={{ border: '1px solid red' }}>
                <h2 key={card._id}>{card.card}</h2>
                <button onClick={() => this.deleteCards(card.card)}>delete card</button>
                {getTodosDB.map(todo => {
                  console.log(todo)
                  if (card.card === todo.list) {
                    console.log('king',todo);
                    // console.log(todo.value)
                    return (
                      <div>
                        <button onClick={() => this.handleModal(todo.value)}>{todo.value}</button>
                        <button onClick={() => this.deleteTodo(todo._id)}>delete todo</button>
                        <Modal show={showModal} onHide={this.handleModal}>
                          <Modal.Header closeButton></Modal.Header>
                          <Modal.Body>
                            <form onSubmit={this.saveChanges}>
                              <label>
                                Card name:
                                <input 
                                  type="text"
                                  value={listValue}
                                  onChange={this.setListValue.bind(this)}
                                />
                              </label>

                              <label>
                                Description:
                                <input 
                                  type="text"
                                  value={description}
                                  onChange={this.setDescription.bind(this)}
                                />
                              </label>

                              <label>
                                Change todo:
                                <input 
                                  type="text"
                                  value={todoValue}
                                  onChange={this.setTodoValue.bind(this)}
                                />
                              </label>
                              <br/>
                              <p>Last changed: {lastChanged}</p>
                              <br/>
                              <p>Flytta todo till:</p>
                              {myCards.map(cards => {
                                return (
                                  <p style={{ border: '3px solid blue' }} onClick={() => this.moveTodos(cards.card)}>{cards.card}</p>
                                )
                              })}
                            </form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.saveChanges}>Save</Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    );
                  }
                })}
                {/* <form onSubmit={e => e.preventDefault()}>
                  <input 
                    type="text"
                    value={todo}
                    onChange={this.setTodo.bind(this)}
                  />
                  <button type="submit" onClick={() => this.addTodo(card.card)}>Add card</button>
                </form> */}
                {/* Kanske använder ej propsen username! */}
                <AddTodo listName={card.card} username={username} getAddingTodos={this.getAddingTodos} />
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default Trello
