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
      user: {}
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.logout = this.logout.bind(this)
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
      user: {}
    })
  }

  componentDidMount = () => {
    var token = localStorage.getItem('mernToken')
    //conditional to determine if the token makes sense
    if (token === 'undefined' || token === null || token === '' || token === undefined){
      localStorage.removeItem('mernToken')
      this.setState({
        token: '',
        user: {}
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

  render() {
    let user = this.state.user
    //check to see if there is a token object with a user in it
    if (typeof user === 'object' && Object.keys(user).length > 0) {
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
