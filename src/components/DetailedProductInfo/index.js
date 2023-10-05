import {Component} from 'react'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class DetailedProductInfo extends Component {
  state = {
    productData: {},
    similarImages: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    category: data.category,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.thumbnail,
    price: data.price,
    rating: data.rating,
    title: data.title,

    discountPercentage: data.discountPercentage,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://dummyjson.com/products/${id}`

    const response = await fetch(apiUrl)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updatedData = this.getFormattedData(data)

      this.setState({
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
        similarImages: data.images,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container">
      <Loader type="TailSpin" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="error view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <button type="button" className="button">
        Continue Shopping
      </button>
    </div>
  )

  renderProductDetailsView = () => {
    const {productData, similarImages} = this.state
    const {
      discountPercentage,
      category,
      description,
      imageUrl,
      brand,
      price,
      rating,
      title,
    } = productData

    return (
      <div className="product-details-success-view">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product">
            <h1 className="product-name">{title}</h1>
            <p className="price-details">Rs {price}/-</p>
            <div className="rating-and-reviews-count">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
            </div>
            <p className="product-description">{description}</p>

            <div className="label-value-container">
              <p className="label">Brand:</p>
              <p className="value">{brand}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Category:</p>
              <p className="value">{category}</p>
            </div>
            <div className="label-value-container">
              <p className="label">Discount Percentage:</p>
              <p className="value">{discountPercentage}</p>
            </div>

            <hr className="horizontal-line" />
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Images</h1>
        <ul className="similar-products-list">
          {similarImages.map(eachSimilarProduct => (
            <img
              src={eachSimilarProduct}
              alt="similar"
              className="similar-image"
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-container">
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default DetailedProductInfo
