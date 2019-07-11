import React, { Component } from 'react'
import { Button, Modal, ModalBody, ModalHeader} from 'reactstrap';

export class InfoSheet extends Component {
  constructor(props) {
    super(props);
    this.toggleSocial= this.toggleSocial.bind(this);
    this.state = {
        social: false,
        facebook:'',
        twitter:'',
        SocialAccount: this.props.SocialAccount,
    };
  }

  componentDidMount(){
    if(this.props.SocialAccount !== []){
      this.props.SocialAccount.forEach((media) =>{
        if (media.Channel === 'Facebook') {this.setState({
          facebook:media.Account
        })}
        if (media.Channel === 'Twitter') {this.setState({
          twitter:media.Account
        })}
      }) 
    } 
  }
  componentDidUpdate(){
    if(this.props.SocialAccount !== this.state.SocialAccount){
      this.setState({
        SocialAccount:this.props.SocialAccount
      })
      this.props.SocialAccount.forEach(media =>{
        if (media.Channel === 'Facebook') {this.setState({
          facebook:media.Account
        })}
        if (media.Channel === 'Twitter') {this.setState({
          twitter:media.Account
        })}
      }) 
    }
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
              {(this.state.facebook !== '')?<Button color="primary" className='mr-4' onClick={this.toggleSocial}><a className='social-btn' href='https://www.facebook.com/'><i className='fa fa-facebook mr-2' ></i> {this.state.facebook}</a></Button>:null}
              {(this.state.twitter !== '')?<Button color="primary" className='mr-4' onClick={this.toggleSocial}><a className='social-btn' href='https://twitter.com/'><i className='fa fa-twitter mr-2' ></i> {this.state.twitter}</a></Button>:null}
            </ModalBody>
          </Modal>
          </span>
        )
    }
}

export default InfoSheet
