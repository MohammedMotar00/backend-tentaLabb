import React, { Component } from 'react'
import axios from 'axios';
import qs from 'query-string';
import AddTodo from './AddTodo';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import { Redirect } from 'react-router-dom';

import './style.css';

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

      logOut: false
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
        this.setState({ username: res.data });
      });

    // Hämtar korten
    axios('/addcard')
      .then(res => {
        this.setState({ myCards: res.data });
      });

    // get all todos for specific cards!
    axios('/gettodos')
      .then(res => {
        this.setState({ getTodosDB: res.data });
      })
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
          this.setState({ myCards: res.data });
        });
      })
  };

  setDescription = (e) => {
    this.setState({ description: e.target.value });
  };

  setTodoValue = (e) => {
    this.setState({ todoValue: e.target.value });
  };

  // Modal stuff
  handleModal = (value) => {
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
    this.setState({ showModal: false });

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
        // get all todos for specific cards!
        axios('/gettodos')
          .then(res => {
            this.setState({ getTodosDB: res.data });
          })
      });
  }

  getAddingTodos = () => {
    // get all todos for specific cards!
    axios('/gettodos')
      .then(res => {
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
        // get all todos for specific cards!
        axios('/gettodos')
          .then(res => {
            this.setState({ getTodosDB: res.data });
          })
      });
  };

  deleteTodo = (id) => {
    axios
      .delete(`/deletetodos/${id}`)
    .then(res => {
      // get all todos for specific cards!
      axios('/gettodos')
        .then(res => {
          this.setState({ getTodosDB: res.data });
        })
    });
  };

  deleteCards = (cardName) => {
    axios
      .delete(`deletecards/${cardName}`)
    .then(res => {
      // Hämtar korten
      axios('/addcard')
      .then(res => {
        this.setState({ myCards: res.data });
      });
    });
  };

  logOut = () => {
    this.setState({ logOut: true });
    this.setState({ username: "" })
    this.setState({ card: "" })

    this.setState({ listValue: "" })
    this.setState({ todoValue: "" })
    this.setState({ description: "" })
    this.setState({ lastChanged: "" })
    this.setState({ cardID: "" })
  };

  render() {
    const { card, username, myCards, getTodosDB, showModal, listValue, todoValue, description, lastChanged, logOut } = this.state;

    if (logOut) return <Redirect to="/" />

    return (
      <div>
        <div>
          <h3>Welcome to Motar Trello!</h3>
          <h3 className="username">Username: {username}</h3>
        </div>
        <div className="add-list__container">
          <form onSubmit={this.addCard.bind(this)}>
            <input 
              type="text"
              value={card}
              onChange={this.setCard.bind(this)}
            />
            <button type="submit">Add list</button>
          </form>
          <div>
            <button className="logout" onClick={this.logOut}>log out</button>
          </div>
        </div>

        <div className="card__container">
          {myCards.map(card => {
            return(
              <div className="card-items__container">
                <div className="card-info__container">
                  <h2 key={card._id}>{card.card}</h2>
                  <button className="delete__card" onClick={() => this.deleteCards(card.card)}>X</button>
                </div>
                <div className="todo__container">
                {getTodosDB.map(todo => {
                  if (card.card === todo.list) {
                    return (
                      <div>
                        <div className="todo-item__container">
                          <button onClick={() => this.handleModal(todo.value)}>{todo.value}</button>
                          <button className="delete__todo" onClick={() => this.deleteTodo(todo._id)}>X</button>
                        </div>
                        <Modal show={showModal} onHide={this.handleModal}>
                          <Modal.Header closeButton><h3>List name: <strong> {listValue}</strong></h3> </Modal.Header>
                          <Modal.Body>
                            <form onSubmit={this.saveChanges}>
                              {/* <p>Card name: <strong>{listValue}</strong></p> */}

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
                              <div className="move__todo">
                                <p style= {{ position: 'absolute', right: "2rem" }}>Move card to:</p>
                                <div className="move__todo__item">
                                  {myCards.map(cards => {
                                    return (
                                      <div className="move-todo-name">
                                        <p onClick={() => this.moveTodos(cards.card)}>{cards.card}</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
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
                </div>
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
