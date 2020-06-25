import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import AdminLogin from './components/login'
import AdminRegister from './components/adminregister';
import UserRegister from './components/userregister';
import Forms from './components/forms';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap';

class App extends React.Component {

  render() {

    return (
      <Router>
        <div style={{ backgroundColor: '#333', overflow: 'hidden' }}>
          <a style={{ float: 'left', color: '#f2f2f2', textAlign: 'center', padding: 14, textDecoration: 'none', fontSize: 17 }} href="userregister">User Register</a>
          <a style={{ float: 'left', color: '#f2f2f2', textAlign: 'center', padding: 14, textDecoration: 'none', fontSize: 17 }} href="adminregister">Admin Register</a>
          <a style={{ float: 'left', color: '#f2f2f2', textAlign: 'center', padding: 14, textDecoration: 'none', fontSize: 17 }} href="adminlogin">Admin Login</a>
          <a style={{ float: 'left', color: '#f2f2f2', textAlign: 'center', padding: 14, textDecoration: 'none', fontSize: 17 }} href="forms">Create Froms</a>
        </div>
        <Route path="/forms" component={Forms} />
        <Route path="/adminlogin" component={AdminLogin} />
        <Route path="/adminregister" component={AdminRegister} />
        <Route path="/userregister" component={UserRegister} />
      </Router>
    );
  }
}

export default App;
