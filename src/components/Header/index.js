import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const logoutButton = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          className="nav-logo"
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
        />
      </Link>
      <li className="nav-options-sm-container">
        <Link to="/">
          <AiFillHome className="icons" />
        </Link>
        <Link to="/jobs">
          <BsFillBriefcaseFill className="icons" />
        </Link>
        <Link to="/login" onClick={logoutButton}>
          <FiLogOut className="icons" />
        </Link>
      </li>
      <li className="nav-options-lg-container">
        <ul className="home-jobs-options-container">
          <Link to="/" className="link-text">
            <li className="home-text">Home</li>
          </Link>
          <Link to="/jobs" className="link-text">
            <li className="home-text">Jobs</li>
          </Link>
        </ul>

        <button className="logout-button" type="button" onClick={logoutButton}>
          Logout
        </button>
      </li>
    </nav>
  )
}
export default withRouter(Header)
