import React, { Component } from 'react';
import { Alert, Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
        username: '',
        email: '',
        password: '',
        password2: '',
        visible: true,
        errors: [],
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
}

// Error display
onDismiss() {
  this.setState({ visible: false });
}

// Fill in value sync
onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
}

// Submit registration
onSubmit (e) {
  e.preventDefault()
  const {username, email, password, password2} = this.state;
  let errors = [];
  // Check all filled in
  if(!username|| !email||!password|| !password2){
    errors.push({msg: 'please fill in all fields'})
  }
  // Check correct email format
  if(!email.includes('@')){
    errors.push({msg: 'please enter a valid email'})
  }

  // Check passwords match
  if(password !== password2){
      errors.push({msg:'Passwords do not match'})
  }
  // Check passwordlength
  if(password.length < 6){
      errors.push({msg: 'Passwords should be at least 6 characters'})
  }

  const user = {
      username: username,
      email: email,
      password: password
  } 

  if (errors.length > 0) {
      this.setState({errors});
      return false;
    } else {
      this.setState({username: '', email: '', password: '', password2: '',errors: [],});
      axios.post('http://localhost:5000/users/register', user)
        .then(res => {
          const data = res.data;
          if (!data.error){
            console.log('Success')
            this.props.history.push('/login')
          } else {
            errors.push({msg: data.error})
            this.setState({errors});
            return false;
          }
          /*  */
    })
  }
}
// Display error
errorDisplay(){
  const {errors} = this.state;
  return errors.map((error, index) => {
    const {msg} = error;
    return (
      <Alert key = {index} color="danger" isOpen={this.state.visible} toggle={this.onDismiss} className='mb-1'>
        {msg}
      </Alert>
    )})
}


  render() {
    return (
      <div className="app flex-row align-items-center register-frame">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4 shadow">
                <CardBody className="p-4">
                  {this.errorDisplay()}
                  <Form noValidate onSubmit={this.onSubmit}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="username"
                                autoComplete="username" 
                                className="form-control"
                                name="username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input  type="email"
                                autoComplete="email" 
                                className="form-control"
                                name="email"
                                placeholder="Enter Email"
                                value={this.state.email}
                                onChange={this.onChange}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password"
                                autoComplete="current-password" 
                                className="form-control"
                                name="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password"
                                autoComplete="repeat-password" 
                                className="form-control"
                                name="password2"
                                placeholder="Repeat password"
                                value={this.state.password2}
                                onChange={this.onChange} />
                    </InputGroup>
                    <Button color="success" type = 'submit' block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
{/*                     <Col xs="12" sm="12">
                      <Button className="btn-facebook mb-1" block><span><i className='fa fa-facebook mr-2'></i> facebook</span></Button>
                    </Col> Notation: future Facebook login  */} 
                    <Col xs="12" sm="12">
                      <Button className="btn-twitter mb-1" block><span><i className='fa fa-user mr-2'></i> NUS Login</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
