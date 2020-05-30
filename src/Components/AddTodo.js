import React, { Component } from 'react'
import axios from 'axios';

import './style.css';

class AddTodo extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      todo: "",
      removeValueTodo: ""
    }
  }

  // Adding todos
  setTodo = (e) => {
    this.setState({ todo: e.target.value });
  }

  addTodo = (e) => {
    e.preventDefault();
    this.setState({ removeValueTodo: this.state.todo, todo: '' });

    let listName = this.props.listName;
    let username = this.props.username;

    axios
      .post('/addtodo', { data: this.state.todo, list: listName, username: username }, {headers: { "Content-Type": "application/json" }})
    .then(res => {
      console.log('sending todo to backend!', res);
      this.props.getAddingTodos();
    });
  };

  render() {
    const { todo } = this.state;

    return (
      <div className="add__todo">
        <div>
          <form onSubmit={this.addTodo.bind(this)}>
            <input 
              type="text"
              value={todo}
              onChange={this.setTodo.bind(this)}
            />
            <button className="add-todo__btn" type="submit">Add card</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddTodo
