import React, { Component } from 'react'
import axios from 'axios';

class AddTodo extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      todo: "",
      removeValueTodo: "",
      todosDB: [],
      todos: []
    }
  }

  componentDidMount() {
    // Get todos from DB
    axios('/addtodo')
      .then(res => {
        console.log(res.data);
        this.setState({ todosDB: res.data });
      });
  };

  // Adding todos
  setTodo = (e) => {
    this.setState({ todo: e.target.value });
  }

  addTodo = (e) => {
    e.preventDefault();
    this.setState({ removeValueTodo: this.state.todo, todo: '' });

    let listName = this.props.listName;

    axios
      .post('/addtodo', { data: this.state.todo, list: listName }, {headers: { "Content-Type": "application/json" }})
    .then(res => {
      console.log('sending todo to backend!', res);
    });

    axios('/addtodo')
    .then(res => {
      console.log(res.data);
    });
  };

  render() {
    const { todo, todosDB, todos } = this.state;

    return (
      <div style={{ border: '1px solid green' }}>
        {todosDB.map(todo => {
          console.log(todo);
          return(
            <div>
              <span><strong>{todo.value}:</strong> </span>
              <span>{todo.time}</span>
            </div>
          );
        })}
        <div>
          <form onSubmit={this.addTodo.bind(this)}>
            <input 
              type="text"
              value={todo}
              onChange={this.setTodo.bind(this)}
            />
            <button type="submit">Add card</button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddTodo
