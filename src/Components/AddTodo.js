import React, { Component } from 'react'
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

class AddTodo extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      todo: "",
      removeValueTodo: "",
      todosDB: [],
      todos: [],

      description: "",
      removeDescriptionValue: "",

      showModal: false
    }
  }

  componentDidMount() {
    // Get todos from DB
    axios('/addtodo')
      .then(res => {
        // console.log(res.data);
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
      // console.log(res.data);
    });
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
        console.log(res.data[0].description);
        this.setState({ description: res.data[0].description })
      });
  };

  setDescription = (e) => {
    this.setState({ description: e.target.value });
  } ;

  saveChanges = (e) => {
    e.preventDefault();
    this.setState({ showModal: false });
    this.setState({ removeDescriptionValue: this.state.description, description: "" });
  };

  render() {
    const { todo, todosDB, todos, showModal, description } = this.state;

    return (
      <div style={{ border: '1px solid green' }}>
        {todosDB.map(todo => {
          // console.log(todo);
          return(
            <div>
              {/* <span><strong>{todo.value}:</strong> </span>
              <span>{todo.time}</span> */}
              <button onClick={() => this.handleModal(todo.value)}>{todo.value}</button>
              <Modal show={showModal} onHide={this.handleModal}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  <h3>Description: </h3>
                  <form onSubmit={this.saveChanges}>
                    <input 
                      type="text"
                      value={description}
                      onChange={this.setDescription.bind(this)}
                    />
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.saveChanges}>Save</Button>
                </Modal.Footer>
              </Modal>
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
