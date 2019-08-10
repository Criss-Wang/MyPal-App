import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from "axios";
import jwt_decode from 'jwt-decode';
import Cookies from 'universal-cookie';

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
        email: '',
        password: '',
        visible: true,
        errors: [],
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
}
componentWillMount(){
  const jwtToken = new Cookies().get('token');
  let errors = [];
  const decoded = (jwtToken === undefined) ? false: jwt_decode(jwtToken);
  if (decoded) {
    const user = {
      email: decoded.email,
      password: "test123"
    }
    console.log(user)
    axios.post('/users/login', user)
        .then(res => {
          const data = res.data;
          console.log(data)
          if (!data.error){
            localStorage.setItem('usertoken', res.data)
            const decoded = jwt_decode(res.data)
            localStorage.setItem('selfInfoId', decoded.infoId) // store the token to local storage
            this.props.history.push('/dashboard')
          } else {
            errors.push({msg: data.error})
            this.setState({errors});
            return false;
          }
    })
  }  
}

// Error display
onDismiss() {
  this.setState({ visible: false });
}

// Input value editing
onChange (e) {
    this.setState({ [e.target.name]: e.target.value })
}

// Submit the form, get authorization token
onSubmit (e) {
    e.preventDefault()
    let errors = [];
    const user = {
        email: this.state.email,
        password: this.state.password
    }

    axios.post('users/login', user)
        .then(res => {
          const data = res.data;
          if (!data.error){
            localStorage.setItem('usertoken', res.data)
            const decoded = jwt_decode(res.data)
            console.log(decoded.infoId)
            localStorage.setItem('selfInfoId', decoded.infoId) // store the token to local storage
            this.props.history.push('/dashboard')
          } else {
            errors.push({msg: data.error})
            this.setState({errors});
            return false;
          }
    })
}

// Give the error display 
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
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    {this.errorDisplay()}
                    <Form noValidate onSubmit={this.onSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input  type="email"
                                autoComplete="email" 
                                className="form-control"
                                name="email"
                                placeholder="Enter Email"
                                value={this.state.email}
                                onChange={this.onChange} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input  type="password"
                                autoComplete="current-password" 
                                className="form-control"
                                name="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={this.onChange} />
                      </InputGroup>
                      <Row>
                        <Col xs="12 text-left">
                          <Button color="primary" className="px-4" type='submit' >Login</Button>
                          <Button color='secondary' className="btn-twitter nuslogin" ><a href='http://localhost:5000/auth/nus' className='NUS'><i className='fa fa-user mr-2'></i> NUS Login</a></Button>
                          
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p className='mt-4'>Enjoy the seamless experience of managing your social network with extreme ease!</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}



export default Login;