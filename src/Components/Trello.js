import React, { Component } from 'react'
import axios from 'axios';
import qs from 'query-string';

class Trello extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      card: '',
      removeValueCard: '',
      username: "",

      cardArr: [],
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

    axios('login')
      .then(res => {
        console.log(res.data);
        this.setState({ username: res.data });
      });
  }

  componentDidUpdate() {
    console.log(this.state.cardArr);
  }

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

  render() {
    const { card, username, cardArr } = this.state;

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
            <button type="submit">Add card</button>
          </form>
        </div>

        <div>
          {cardArr.map(card => {
            return(
              <div>
                <h1>{card.card}</h1>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}

export default Trello
