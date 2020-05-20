import React, { Component } from 'react'
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';

class AddTodo extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      todo: "",
      removeValueTodo: "",
      todosDB: [],
      todos: [],

      listValue: "",
      todoValue: "",
      description: "",
      lastChanged: "",
      cardID: "",

      removeListValue: "",
      removeTodoValue: "",
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
        console.log(res.data[0]);
        this.setState({ description: res.data[0].description });
        this.setState({ listValue: res.data[0].list });
        this.setState({ todoValue: res.data[0].value });
        this.setState({ lastChanged: res.data[0].time });
        this.setState({ cardID: res.data[0]._id });
      });
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
      });
  };

  render() {
    const { todo, todosDB, todos, showModal, description, listValue, todoValue, lastChanged } = this.state;

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
                    <button>Kort1</button>
                    <button>Kort2</button>
                    <button>Kort3</button>
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
