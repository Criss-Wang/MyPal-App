import React, { Component } from 'react'
import { Container, Nav, Button, ButtonGroup } from 'reactstrap';
import Icon from './Brand.png';
import { AppHeader, AppNavbarBrand, AppSidebarToggler,} from '@coreui/react';


export class Landing extends Component {
    constructor(props) {
        super(props);
        this.onLogin = this.onLogin.bind(this);
        this.onReg = this.onReg.bind(this);
        this.state = {
          modal: false,
        };
      }
    
    // Login Link
    onLogin(e) {
        e.preventDefault()
        this.props.history.push('/login')
    }; 

    // Registration Link
    onReg(e) {
        e.preventDefault()
        this.props.history.push('/register')
    }; 

    render() {
        return (
            <div className="app">
                {/* Header with Login and registration buttons */}
                <AppHeader fixed className='frameheader2 shadow'>
                    <AppSidebarToggler className="d-lg-none" display="md" mobile />
                    {/* Shrinkable Brand */}
                    <AppNavbarBrand
                    full={{ src: Icon, width: 140, height: 35, alt: 'MyPal Logo' }}
                    minimized={{ src: Icon, width: 34, height: 34, alt: 'MyPal Logo' }}
                    className='pl-5'/>
                    <Nav className="d-md-down-none ml-auto mr-3" navbar>
                        <ButtonGroup className='mr-3'>
                            <Button color='light'  outline onClick={e=>this.onReg(e)} 
                            className=" add-btn" id="reg_btn"><i class="fa fa-user"></i>
                            &nbsp; Register </Button>
                            <Button color='light'  outline onClick={e=>this.onLogin(e)} 
                            className="mr-1 add-btn" id="reg_btn"><i class="fa fa-sign-in"></i>
                            &nbsp; Login </Button>
                        </ButtonGroup>                    
                    </Nav>
                </AppHeader>
                {/* Main Body with Title and Login link */}
                <div className="app-body landing-app-body">
                <main className="main landing">
                    <Container fluid>
                    <div className="caption text-center">
                        <h1>Welcome To MyPal</h1>
                        <h3 className='shadow mb-5'>Your Smart, Simple, and Attractive central platform to manage your social relationships in NUS</h3>
                        <Button color='primary' size='lg' outline onClick={e=>this.onLogin(e)} 
                        className="mr-1 start-btn d-md-down-none">
                         Get Started </Button>      
                         <div className='footertext2 mt-4 ml-0'> <a href="https://github.com/Criss-Wang/TeamRichardoMLu" disabled><i className='fa fa-github UrlLink'></i></a>&nbsp; 2019 NUS Orbital Project: <strong> MyPal </strong> </div>
              
                    </div>
                    </Container>
                </main>
                {/* Footer for credit to coreui */}
                <div className='mt-auto Landingf'>
                    
                    <span className="ml-auto footertext mr-3 mb-3">Powered by <a href="https://coreui.com" disabled>CoreUI</a></span>
                </div>
                </div>

            </div>
        
        )
    }
}

export default Landing
