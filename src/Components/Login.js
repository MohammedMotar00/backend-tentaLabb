import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      loggedIn: false,
      value: "",
      removeValue: ""
    }
  }

  setName = (e) => {
    this.setState({ value: e.target.value });
  };

  logIn = (e) => {
    e.preventDefault();
    this.setState({ loggedIn: true });
  };

  render() {
    const { value, loggedIn } = this.state;

    if (loggedIn) return <Redirect to={`/trello?username=${value}`} /> 

    return (
      <div>
        <form onSubmit={this.logIn.bind(this)}>
          <label>
            Name:
            <input type="text" value={value} onChange={this.setName.bind(this)} />
          </label>
          <button type="submit">Logga in</button>
        </form>
      </div>
    )
  }
}

export default Login
