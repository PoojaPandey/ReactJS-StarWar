import React, { Component } from "react";
import { Button, FormGroup, FormControl, Image } from "react-bootstrap";
import "./Login.css";
import logo from './starwar_logo.png';
import loader from './loading.gif';
import { browserHistory } from 'react-router';
import { reactLocalStorage } from 'reactjs-localstorage';

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      showLoader: true
    };
  }

  componentDidMount() {
    if (reactLocalStorage.getObject('user')) {
      browserHistory.push('/Profile')
    }
  }
  setLoader(bool) {
    this.setState({
      showLoader: bool
    });
  }
  validateForm() {
    if (this.state.username.length <= 0 || this.state.password.length <= 0) {
      alert('Please enter username and password')
      console.log('Please enter username and password')
    }
    else {
      this.setLoader(false)
      fetch('https://swapi.co/api/people/?search=' + this.state.username)
        .then((response) => response.json())
        .then((responseJson) => {
          this.setLoader(true)
          var data = responseJson.results
          console.log(data[0])

          if (data[0] !== null) {
            if (this.state.username === data[0].name && this.state.password === data[0].birth_year) {
              reactLocalStorage.setObject('user', data[0]);
              this.setState({ username: null, password: null })
              browserHistory.push('/Profile')
            }
            else {
              alert('Wrong username or password');
            }
          }
          else {
            alert('Wrong username or password');
          }
        })
        .catch((error) => {
          this.setLoader(true)
          alert(error);
        });
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

  }

  render() {
    return (
      <body className="Login">
        <div >
          <div align="center">
            <img src={logo} alt="logo" ></img>
          </div>
          <form onSubmit={this.handleSubmit} >
            <FormGroup controlId="username" bsSize="large">
              <FormControl className="Input" type='username' name='username' placeholder='username' value={this.state.username}
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <FormControl className="Input" type='password' name='password' placeholder='password' value={this.state.password}
                onChange={this.handleChange} />
            </FormGroup>
            <div align="center" >
              <Button
                block
                className="Button"
                class="btn btn-warning"
                bsSize="large"
                onClick={this.validateForm.bind(this)}
                type="submit">
                Login
          </Button>
              <br></br>
              <br></br>
              <br></br>
              <img src={loader} alt="loader" hidden={this.state.showLoader} style={{ width: 50, height: 50, align: 'center' }}></img>
              <div id="render-target"></div>
            </div>
          </form>
        </div>
      </body>
    );
  }
}