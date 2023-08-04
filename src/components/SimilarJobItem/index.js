import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    title,
    rating,
  } = similarJobDetails

  return (
    <li className="jobs-list-container">
      <div className="logo-title-container">
        <img
          className="tech-logo"
          alt="similar job company logo"
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
      <h1 className="description">Description</h1>
      <p className="description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobItem
