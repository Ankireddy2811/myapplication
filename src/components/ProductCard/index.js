import {Link} from 'react-router-dom'
import {Component} from 'react'
import {MdDelete} from 'react-icons/md'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'

import './index.css'

class ProductCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title1: props.productData.title,
      isSaveClicked: false,
    }
  }

  onDeleteItem = () => {
    const {deleteProduct} = this.props
    const {productData} = this.props
    deleteProduct(productData.id)
  }

  changeTitle = event => {
    this.setState({title1: event.target.value})
  }

  onCloseButton = () => {
    this.setState(prevState => ({isSaveClicked: !prevState.isSaveClicked}))
  }

  submitForm = event => {
    event.preventDefault()
    this.setState(prevState => ({isSaveClicked: !prevState.isSaveClicked}))
    const {productData, updateProductTitle} = this.props
    const {title1} = this.state
    updateProductTitle(productData.id, title1)
  }

  render() {
    const {productData} = this.props
    const {title1, isSaveClicked} = this.state
    const saveText = isSaveClicked ? 'saved' : 'save'
    const {title, category, imageUrl, rating, price, id} = productData
    return (
      <div className="link-item">
        <li className="product-item">
          <img src={imageUrl} alt="product" className="thumbnail" />
          <div className="title-link">
            <h1 className="title">{title}</h1>
            <Link to={`/products/${id}`}>
              <button type="button" className="save-button view-button">
                View
              </button>
            </Link>
          </div>

          <p className="brand">{category}</p>

          <div className="product-details">
            <p className="price">Rs {price}/-</p>
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
          </div>
          <div className="edit-delete">
            <Popup
              modal
              contentStyle={{
                borderRadius: '10px',
                height: 'auto',
                maxWidth: '400px',
                backgroundColor: '#ffffff',
                padding: '20px',
              }}
              overlayStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
              }}
              trigger={
                <button type="button" className="edit-button">
                  Edit
                </button>
              }
            >
              {close => (
                <form className="form-container" onSubmit={this.submitForm}>
                  <label htmlFor="updateTitle">Update Title</label>
                  <input
                    className="input-ele"
                    type="text"
                    value={title1}
                    onChange={this.changeTitle}
                    id="updateTitle"
                  />
                  <br />

                  <div className="buttons-container">
                    <button
                      type="submit"
                      className={`save-button ${isSaveClicked ? 'saved' : ''}`}
                    >
                      {saveText}
                    </button>
                    <button
                      type="button"
                      className="trigger-button"
                      onClick={() => {
                        close()
                        this.onCloseButton()
                      }}
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </Popup>

            <button
              type="button"
              className="delete-button"
              onClick={this.onDeleteItem}
            >
              <MdDelete className="delete-icon" />
            </button>
          </div>
        </li>
      </div>
    )
  }
}
export default ProductCard
