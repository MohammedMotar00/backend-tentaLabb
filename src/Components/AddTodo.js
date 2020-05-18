import React, { Component } from 'react'

class AddTodo extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      todo: "",
      removeValueTodo: "",
      todos: []
    }
  }

  // Adding todos
  setTodo = (e) => {
    this.setState({ todo: e.target.value });
  }

  addTodo = (e) => {
    e.preventDefault();
    let listName = this.props.listName;
  };

  render() {
    const { todo, todos } = this.state;

    return (
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
    )
  }
}

export default AddTodo
