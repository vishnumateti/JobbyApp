import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import SimilarJobItem from '../SimilarJobItem'
import Header from '../Header'

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiJobsStatusConstants.initial,
    specifiedJobData: [],
    similarJobsList: [],
  }

  componentDidMount() {
    this.getSpecificJobsData()
  }

  getSpecificJobsData = async () => {
    this.setState({apiStatus: apiJobsStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const specifiedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
      }
      const similarJobsData = data.similar_jobs.map(similarJob => ({
        companyLogoUrl: similarJob.company_logo_url,
        employmentType: similarJob.employment_type,
        jobDescription: similarJob.job_description,
        location: similarJob.location,
        rating: similarJob.rating,
        title: similarJob.title,
      }))
      this.setState({
        apiStatus: apiJobsStatusConstants.success,
        specifiedJobData: specifiedJobDetails,
        similarJobsList: similarJobsData,
      })
    } else {
      this.setState({apiStatus: apiJobsStatusConstants.failure})
    }
  }

  renderJobsSuccessView = () => {
    const {specifiedJobData, similarJobsList} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      title,
      rating,
      skills,
      lifeAtCompany,
    } = specifiedJobData
    const {description, imageUrl} = lifeAtCompany

    return (
      <div>
        <div className="jobs-list-container">
          <div className="logo-title-container">
            <img
              className="tech-logo"
              alt="job details company logo"
              src={companyLogoUrl}
            />
            <div className="title-container">
              <h1 className="job-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar className="star-logo" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-jobs-package-container">
            <div className="location-jobs-container">
              <div className="location-container">
                <p className="location">{location}</p>
              </div>
              <div className="location-container">
                <BsFillBriefcaseFill className="pin-icon" />
                <p className="location">{employmentType}</p>
              </div>
            </div>
            <p className="location">{packagePerAnnum}</p>
          </div>
          <hr />
          <div>
            <h1 className="description">Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p className="description">{jobDescription}</p>
        </div>
        <h1>Skills</h1>
        <ul>
          {skills.map(eachSkill => (
            <li key={eachSkill.name}>
              <img alt={eachSkill.name} src={eachSkill.imageUrl} />
              <p>{eachSkill.name}</p>
            </li>
          ))}
        </ul>
        <div>
          <h1>Life at Company</h1>
          <p>{description}</p>
          <img alt="life at company" src={imageUrl} />
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobsList.map(eachSimilar => (
            <SimilarJobItem
              key={eachSimilar.id}
              similarJobDetails={eachSimilar}
            />
          ))}
        </ul>
      </div>
    )
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
        We cannot seem to find the page you are looking for
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

  retryApiJobs = () => {
    this.getSpecificJobsData()
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSpecifiedJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
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

  render() {
    return (
      <div>
        <Header />
        {this.renderSpecifiedJobs()}
      </div>
    )
  }
}

export default JobItemDetails
