import {Link} from 'react-router-dom'

import Header from '../Header'
import './index.css'

const HomePage = () => (
  <div className="bg-home-container">
    <Header />
    <div>
      <div className="home-details-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="paragraph">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the Login R job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="find-jobs-button" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default HomePage
