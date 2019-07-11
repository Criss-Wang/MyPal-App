import React, { Component, Suspense } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
//import { renderRoutes } from 'react-router-config';
import './App.scss';
import Auth from "./Auth";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    (Auth()) === true
      ? <DefaultLayout {...props} />
      : <Redirect to='/login' />
  )} />
)

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Landing = React.lazy(() => import('./views/Pages/Landing/Landing'));
const Register = React.lazy(() => import('./views/Pages/Register/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));
const Login = React.lazy(() => import('./views/Pages/Login/Login'));

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Login: true,
    };
  }

  
 
  render() {
    return (
      <div>
      <HashRouter>
          <Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/Landing" name="Landing Page" render={props => <Landing {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route exact path="/Login" name="Login" render={props => <Login {...props}/>} />
              <PrivateRoute path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
            </Switch>
          </Suspense>
      </HashRouter>
      </div>
    );
  }
}

export default App;
