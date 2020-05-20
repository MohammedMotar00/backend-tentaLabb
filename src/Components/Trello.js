import React, { Component } from 'react'
import axios from 'axios';
import qs from 'query-string';
import AddTodo from './AddTodo';

class Trello extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      username: "",

      card: '',
      removeValueCard: '',
      myCards: [],

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

      axios('/addcard')
        .then(res => {
          console.log(res.data);
          this.setState({ myCards: res.data });
        });
  }

  componentDidUpdate() {
    console.log(this.state.cardArr);
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
      })
  };

  // // Adding todos
  // setTodo = (e) => {
  //   this.setState({ todo: e.target.value });
  // }

  // addTodo = (name) => {
  //   console.log(name);
  // };

  render() {
    const { card, username, myCards, todo, todos } = this.state;

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
            return(
              <div style={{ border: '1px solid red' }}>
                <h2 key={card._id}>{card.card}</h2>
                {/* <form onSubmit={e => e.preventDefault()}>
                  <input 
                    type="text"
                    value={todo}
                    onChange={this.setTodo.bind(this)}
                  />
                  <button type="submit" onClick={() => this.addTodo(card.card)}>Add card</button>
                </form> */}
                <AddTodo listName={card.card} />
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default Trello
