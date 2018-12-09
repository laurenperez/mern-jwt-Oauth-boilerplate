import React, { Component } from 'react';
import Signup from './Signup';
import Login from './Login';
import UserProfile from './UserProfile';
import axios from 'axios';

class App extends Component {
  constructor(){
    super()
    this.state = {
      token: '',
      user: null,
      googleUser: null
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.logout = this.logout.bind(this)
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.checkForGoogleUser = this.checkForGoogleUser.bind(this)
  }


  liftTokenToState = (data) => {
    this.setState({
      token: data.token,
      user: data.user
    })
  }


  logout = () => {
    console.log("you are logging out...")
    localStorage.removeItem('mernToken')
    this.setState({
      token: '',
      user: null,
      googleUser: null
    })
    //this hits a route that clears our session
    axios.get('/auth/logout', result => console.log(result))
  }


  checkForLocalToken = () => {
    var token = localStorage.getItem('mernToken')
    //conditional to determine if the token makes sense
    if (token === 'undefined' || token === null || token === '' || token === undefined){
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      axios.post('/auth/me/from/token', {
        token: token
      }).then( result => {
        localStorage.setItem('mernToken', result.data.token)
        this.setState({
          token: result.data.token,
          user: result.data.user
        })
      }).catch( err => console.log(err) )
    }
  }


  checkForGoogleUser = () => {
    axios.get('/auth/user').then( response => {
      if (response.data.user) {
        //We found a google user in the session
        let googleUser = {
          googleId: response.data.user.googleId,
          displayName: response.data.user.displayName
        }
        this.setState({
          googleUser: googleUser
        })
      } else {
        // We did not find a google user
        this.setState({
          googleUser: null
        })
      }
    })
  }


  componentDidMount = () => {
    this.checkForGoogleUser();
    this.checkForLocalToken();
  }

  render() {
    let user = this.state.user || this.state.googleUser
    //check to see if there is a token object with a user in it
    if (user) {
      return (
        <div>
          <UserProfile user={user} logout={this.logout} />
        </div>
      )
    } else {
      return (
      <div>
        <Signup liftToken={this.liftTokenToState} />
        <Login liftToken={this.liftTokenToState} />
      </div>
    )};
  }
}

export default App;
