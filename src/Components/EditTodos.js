import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';

class EditTodos extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      showModal: false
    }
  }

  handleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  saveChanges = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <>
        <Button onClick={this.handleModal}>hejjj</Button>
        {/* <Modal show={showModal} onHide={this.handleModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h1>Description: <p>{todo.description}</p></h1>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.saveChanges}>Save</Button>
          </Modal.Footer>
        </Modal> */}
      </>
    )
  }
}

export default EditTodos
