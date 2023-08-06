import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobsItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    title,
    rating,
    id,
  } = jobDetails

  return (
    <li className="jobs-list-container">
      <Link to={`/jobs/${id}`} className="link">
        <div className="logo-title-container">
          <img className="tech-logo" alt="company logo" src={companyLogoUrl} />
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
              <MdLocationOn className="pin-icon" />
              <p className="location">{location}</p>
            </div>
            <div className="location-container">
              <BsFillBriefcaseFill className="pin-icon" />
              <p className="location">{employmentType}</p>
            </div>
          </div>
          <p className="location">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <h1 className="description">Description</h1>
        <p className="description-para">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobsItem
