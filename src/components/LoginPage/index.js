import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginPage extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  loginFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onLoginSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginHomePage = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch('https://apis.ccbp.in/login', options)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  usernameInput = event => {
    this.setState({username: event.target.value})
  }

  userPassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, errorMsg, showError} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <div className="card-container">
          <img
            className="website-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
          />
          <form className="form-container" onSubmit={this.loginHomePage}>
            <label className="username" htmlFor="username">
              USERNAME
            </label>
            <input
              className="input-field"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={this.usernameInput}
            />
            <label className="username" htmlFor="password">
              PASSWORD
            </label>
            <input
              className="input-field"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={this.userPassword}
            />
            <button className="login-button" type="submit">
              Login
            </button>
            {showError && <p className="error-text">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginPage
