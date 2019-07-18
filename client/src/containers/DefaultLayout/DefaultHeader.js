import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, 
         Button, Input, InputGroup, InputGroupAddon, InputGroupText, Popover, 
         PopoverBody, PopoverHeader, ListGroup, ListGroupItem,} from 'reactstrap';
import PropTypes from 'prop-types';
import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/Brand.png'
import sygnet from '../../assets/img/brand/Brand2.png'
import Add from './InfoSheet.js'
import jwt_decode from 'jwt-decode'
import axios from 'axios';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.togglepopover = this.togglepopover.bind(this);
    this.state = {
      popoverOpen: false,
      selectedFile: null,
      img: '',
      name: '',
      email: '',
      selfUpdated: false,
    };
  }

//Extract User name and email up on successful login
  componentDidMount () {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const infoId = localStorage.selfInfoId
    axios.get(`personals/getPersonal/${infoId}`)
          .then(res => {
              const Name = `${res.data.firstName} ${res.data.lastName}`
              this.setState({
                  img:res.data.img,
                  name: Name,
                  username: decoded.username
              })
          });
  }

// Update content
  componentDidUpdate(){
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const infoId = localStorage.selfInfoId
    if(this.state.selfUpdated !== this.props.selfUpdated){
      axios.get(`personals/getPersonal/${infoId}`)
          .then(res => {
              const Name = `${res.data.firstName} ${res.data.lastName}`
              this.setState({
                  img:res.data.img,
                  name: Name,
                  username:decoded.username
              })
          })
          .then(
            this.props.updateSelfInfo(false)
          );
      
  }
  }

//For Reminder Popover
  togglepopover() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        {/* Shrinkable Brand */}
        <AppNavbarBrand
          full={{ src: logo, width: 140, height: 35, alt: 'MyPal Logo' }}
          minimized={{ src: sygnet, width: 34, height: 34, alt: 'MyPal Logo' }}
          className='pl-2'/>
        {/* Search Bar */}
        <Nav className="d-md-down-none ml-5" navbar>
          <NavItem>
            <InputGroup className="input-prepend">
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fa fa-search"></i>
                </InputGroupText>
              </InputGroupAddon>
              <Input size="40" type="text" placeholder="What are you looking for?"/>
              <InputGroupAddon addonType="append">
                <Button color="primary">Search</Button>
              </InputGroupAddon>
            </InputGroup>
          </NavItem>
        </Nav>
        {/* Navbar set */}
        <Nav className="ml-auto" navbar>
          {/* Add Contact Modal */}
          <NavItem>
            <Add updateInfo = {this.props.updateInfo}
                 updateEventInfo = {this.props.updateEventInfo}/>
          </NavItem>
          {/* Reminder popover */}
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link mt-1" onClick={this.togglepopover} id="Reminder" >
              <i className="icon-bell" id='reminder'></i><Badge pill color="danger">2</Badge>
              <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Reminder" toggle={this.togglepopover}>
                <PopoverHeader>Reminders</PopoverHeader>
                <PopoverBody>
                <ListGroup className="list-group-accent" tag={'div'}>
                  <ListGroupItem action tag="a" href="#" className="list-group-item-accent-warning list-group-item-divider">
                    <div className="avatar float-right">
                      <img className="img-avatar" src="assets/img/avatars/7.jpg" alt="admin@bootstrapmaster.com"></img>
                    </div>
                    <div>Birthday for <strong>Lucas</strong> </div>
                    <small className="text-muted mr-3">
                      <i className="icon-calendar"></i>&nbsp; June 3rd
                    </small>
                    <small className="text-muted">
                      <i className="icon-location-pin"></i> Celebrate!
                    </small>
                  </ListGroupItem>
                  <ListGroupItem action tag="a" href="#" className="list-group-item-accent-danger list-group-item-divider">
                    <div className="avatar float-right">
                      <img className="img-avatar" src="assets/img/avatars/4.jpg" alt="admin@bootstrapmaster.com"></img>
                    </div>
                    <div> Remember your friend <strong>Megan</strong>?</div>
                    <small className="text-muted mr-3">
                      <i className="icon-calendar"></i>&nbsp; had event 9 months ago
                    </small>
                    <div>
                    <small className="text-muted">
                      <i className="icon-social-skype"></i> Contact him!
                    </small>
                    </div>
                  </ListGroupItem>
                </ListGroup> 
                </PopoverBody>
            </Popover>
            </NavLink>
          </NavItem>
          {/* User Admin */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav className='mr-3'>
              <img src={(this.state.img === ''? '../../assets/img/defaultUser.png':this.state.img)} className="user-icon-header img-avatar" alt="admin@bootstrapmaster.com" /> <span id='reminder2'>
              {(this.state.name === '' || this.state.name === ' ')?this.state.username:this.state.name}</span>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }} className='mt-2'>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-cog"></i> Setting</DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
