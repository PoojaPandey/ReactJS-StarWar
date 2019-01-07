import React, { Component } from "react";
import { reactLocalStorage } from 'reactjs-localstorage';
import { Button, Timer } from "react-bootstrap";
import { browserHistory } from 'react-router';
import { transparent, white } from "material-ui/styles/colors";
import Countdown from 'react-countdown-now';

export default class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      temp: [],
      planetValue: {},
      hiddenHeading: true,
      showPopup: false,
      countDownTime: 60,
      secondsLeft: 60,
      hasRun: false,
      apiHitCount: 0,
      disableSearch: false,
      authenticated: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
  }

  componentDidMount() {
    if (!reactLocalStorage.getObject('user')) {
      browserHistory.push("/");
    }
  }

  componentWillUnmount() {
    clearInterval(this.incrementer)
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.items
    });
  }

  handleChange(e) {
    if (reactLocalStorage.getObject('user').name !== 'Luke Skywalker') {
      if (this.state.hasRun === false) {
        this.setState({
          countDownTime: 60,
          secondsLeft: 60
        });
        this.handleStartClick()
      } else {
        console.log("secondsLeft", +this.state.secondsLeft)
        console.log("apiHitCount", +this.state.apiHitCount)
        if (this.state.secondsLeft > 0 && this.state.apiHitCount === 5) {
          alert("Your search limit has been reached, Please wait for 30 seconds.")
          this.setState({
            disableSearch: true,
            secondsLeft: 30
          });
          return false
        }
        this.setState({
          countDownTime: 0
        });
      }
    }
    if (e.target.value !== "") {
      fetch('https://swapi.co/api/planets/?search=' + e.target.value)
        .then((response) => response.json())
        .then((responseJson) => {

          let array = responseJson['results']
          array.sort(function (a, b) {
            return parseInt(a.population) - parseInt(b.population);
          })
          this.setState({
            temp: array,
            planetValue: {},
            hiddenHeading: true,
            apiHitCount: this.state.apiHitCount + 1
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      this.setState({
        temp: [],
        planetValue: {},
        hiddenHeading: true
      });
    }
  }


  clicked(data) {
    var dataVal = data
    this.setState({
      planetValue: dataVal
    });
    this.setState({
      hiddenHeading: false
    });
    this.togglePopup()
  }

  getFontSize = (data) => {
    var number = Math.floor(Math.log(data.population) / Math.LN10 + 1)
    number = number * 3
    return number
  }

  logoutClicked() {
    reactLocalStorage.setObject('user', null)
    browserHistory.push("/");
  }

  handleStartClick() {
    this.incrementer = setInterval(() => {
      this.setState({
        secondsLeft: (this.state.secondsLeft - 1)
      });
      if (this.state.secondsLeft === 0) {
        if (this.state.apiHitCount === 5) {
          alert("Now you can start your search")
        }
        this.setState({
          apiHitCount: 0,
          disableSearch: false,
          hasRun: false
        });
        clearInterval(this.incrementer);
      }
    }, 1000);
    this.setState({
      incrementer: this.incrementer,
      hasRun: true
    });
  }

  render() {
    return (
      <body className="ProfileBack">
        <a className="Details" href="/" onClick={this.logoutClicked.bind(this)}>Logout</a>
        <form className="ProfileContainer">
          <input type="text" className="Search" onChange={this.handleChange} disabled={(this.state.disableSearch) ? "disabled" : ""} placeholder="Search for planet...">
          </input>
          <ul>
            {this.state.temp.map((data, index) => (
              <li className="Search" key={data} onClick={() => this.clicked(data)} style={{ height: 'auto', fontSize: this.getFontSize(data) }}>
                {data.name} having population {data.population}.
                    </li>
            ))}
          </ul>
          {this.state.showPopup ?
            <div>
              <div className='popup'>
                <div className='popup_inner'>
                  <div className='headingStyle'>
                    <h1 className='header' id="information" hidden="true" hidden={this.state.hiddenHeading}>Planet Information</h1>
                    <Button bsSize="small" type="submit" onClick={this.togglePopup.bind(this)} style={{ height: '20px', backgroundColor: transparent, fontSize: 25, borderWidth: 0 }}>X</Button>
                  </div>
                  <ul style={{ maxHeight: '80%', overflow: 'auto', left: '20%' }}>
                    {Object.keys(this.state.planetValue).map((data, index) => (
                      <div key={index} style={{ fontWeight: 'bold' }} >
                        {data}
                        {[this.state.planetValue[data]].map((val, index) => (

                          <ul className="DetailsPopup" key={val}>
                            {Array.isArray(val)
                              ? val.map((array, index) => (
                                <ul className="DetailsPopup" key={array}>
                                  {array}
                                  {console.log(array)}
                                </ul>
                              ))
                              :
                              val
                            }
                            {console.log(val)}
                          </ul>
                        ))}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            : null
          }
        </form>
      </body>
    )
  }
}