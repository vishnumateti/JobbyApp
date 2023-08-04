import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobsItem from '../JobsItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class JobsPage extends Component {
  state = {
    profileData: {},
    apiProfileStatus: apiProfileStatusConstants.initial,
    jobsData: [],
    apiJobsStatus: apiJobsStatusConstants.initial,
    employType: [],
    radioInput: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const {searchInput, employType, radioInput} = this.state
    employType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employType}&minimum_package=${radioInput}&search=${searchInput}`
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsData: updatedJobsData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  onClickSalaryRange = event => {
    this.setState({radioInput: event.target.id}, this.getJobsData)
  }

  onClickEmployType = event => {
    const {employType} = this.state
    const inputsNotInList = employType.filter(
      eachType => eachType === event.target.id,
    )
    if (inputsNotInList.length === 0) {
      this.setState(
        prevState => ({employType: [...prevState.employType, event.target.id]}),
        this.getJobsData,
      )
    } else {
      const filteredData = employType.filter(each => each !== event.target.id)
      this.setState(
        {
          employType: filteredData,
        },
        this.getJobsData,
      )
    }
  }

  searchInputValue = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearch = () => {
    this.getJobsData()
  }

  enterSearchResults = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  getProfileDetails = async () => {
    this.setState({apiProfileStatus: apiProfileStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok) {
      const data = await response.json()

      const updatedProfileData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedProfileData,
        apiProfileStatus: apiProfileStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiProfileStatusConstants.failure})
    }
  }

  retryApiProfile = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryApiProfile}
      >
        Retry
      </button>
    </div>
  )

  retryApiJobs = () => {
    this.getJobsData()
  }

  renderJobsFailureView = () => (
    <div className="failure-job-container">
      <img
        className="failure-img"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="wrong-text">Oops! Something Went Wrong</h1>
      <p className="wrong-caption">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryApiJobs}
      >
        Retry
      </button>
    </div>
  )

  renderJobsSuccessView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0

    return noJobs ? (
      <div>
        <img
          alt="no jobs"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="jobs-section-container">
        {jobsData.map(eachJob => (
          <JobsItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData

    return (
      <div className="profile-bg-card-container">
        <div className="profile-bg">
          <img className="profile-pic" alt="profile" src={profileImageUrl} />
          <h1 className="profile-name">{name}</h1>
          <p className="bio-text">{shortBio}</p>
        </div>
        <hr className="line" />
        <ul>
          <h1 className="employment-type-heading">Type of Employment</h1>

          {employmentTypesList.map(eachType => (
            <li key={eachType.employmentTypeId}>
              <input
                className="inp-checkbox"
                type="checkbox"
                id={eachType.employmentTypeId}
                onChange={this.onClickEmployType}
              />
              <label
                className="type-label-text"
                htmlFor={eachType.employmentTypeId}
              >
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="line" />
        <ul>
          <h1 className="employment-type-heading">Salary Range</h1>
          {salaryRangesList.map(eachSalary => (
            <li key={eachSalary.salaryRangeId}>
              <input
                className="inp-checkbox"
                type="radio"
                name="option"
                id={eachSalary.salaryRangeId}
                onChange={this.onClickSalaryRange}
              />
              <label
                className="type-label-text"
                htmlFor={eachSalary.salaryRangeId}
              >
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsData = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiJobsStatusConstants.success:
        return this.renderJobsSuccessView()
      case apiJobsStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  renderProfileSection = () => {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiProfileStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiProfileStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-bg-container">
        <Header />
        <div className="jobs-section-container">
          <div className="input-container">
            <input
              value={searchInput}
              type="search"
              placeholder="search"
              className="input"
              onChange={this.searchInputValue}
              onKeyDown={this.enterSearchResults}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.onSubmitSearch}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          {this.renderProfileSection()}
          {this.renderJobsData()}
        </div>
      </div>
    )
  }
}

export default JobsPage
