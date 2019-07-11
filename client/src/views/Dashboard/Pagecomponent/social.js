import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export class InfoSheet extends Component {
  constructor(props) {
    super(props);
    this.toggleSocial= this.toggleSocial.bind(this);
    this.state = {
        social: false,
        facebook: this.props.facebook,
        twitter: this.props.twitter,
    };
  }

  // toggle social contact
  toggleSocial() {
    this.setState({
      social: !this.state.social,
    });
  }   
    render() {
        return (
          <span>
            <Button  color='ghost-dark ' onClick={this.toggleSocial} className='mr-1'><i className="fa fa-comments"></i> </Button>
          <Modal isOpen={this.state.social} toggle={this.toggleSocial}
            className={'modal-primary' + this.props.className} id='modalCenter'>
            <ModalHeader toggle={this.toggleSocial}><i className='fa fa-comments-o mr-1' ></i> Social Contact</ModalHeader>
            <ModalBody className='modalbody text-center mt-2 mb-2'>
              <Button color="primary" className='mr-4' onClick={this.toggleSocial}><i className='fa fa-facebook mr-2' ></i> {this.state.facebook}</Button>{' '}
              <Button color="primary" className='mr-4' onClick={this.toggleSocial}><i className='fa fa-twitter mr-2' ></i> {this.state.twitter}</Button>
            </ModalBody>
          </Modal>
          </span>
        )
    }
}

export default InfoSheet
