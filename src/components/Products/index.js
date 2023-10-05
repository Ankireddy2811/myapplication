import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {IoMdAdd} from 'react-icons/io'

import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'

import './index.css'

const categoryOptions = [
  {
    name: 'Smartphones',
    categoryId: 'smartphones',
  },
  {
    name: 'Laptops',
    categoryId: 'laptops',
  },
  {
    name: 'Fragrances',
    categoryId: 'fragrances',
  },
  {
    name: 'Skincare',
    categoryId: 'skincare',
  },
  {
    name: 'Groceries',
    categoryId: 'groceries',
  },
  {
    name: 'Home Decoration',
    categoryId: 'home-decoration',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Products extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeCategoryId: '',
    searchInput: '',
    isSaveClicked: false,
    addDataForm: {
      title: '',
      category: '',
      imageurl: '',
      price: '',
    },
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const {searchInput, activeCategoryId} = this.state
    console.log(searchInput)
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    let response

    if (activeCategoryId === '') {
      response = await fetch(
        `https://dummyjson.com/products/search?q=${searchInput}`,
      )
    } else {
      response = await fetch(
        `https://dummyjson.com/products/category/${activeCategoryId}`,
      )
    }

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.products.map(product => ({
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        imageUrl: product.thumbnail,
        rating: product.rating,
        id: product.id,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  deleteProduct = async id => {
    const {productsList} = this.state
    const options = {
      method: 'DELETE',
    }
    const response = await fetch(
      `https://dummyjson.com/products/${id}`,
      options,
    )

    const data = await response.json()

    if (data.isDeleted) {
      const filteredData = productsList.filter(eachItem => eachItem.id !== id)
      this.setState({productsList: filteredData})
    }
  }

  updateProductTitle = async (id, title) => {
    const {productsList} = this.state
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
      }),
    }
    const response = await fetch(
      `https://dummyjson.com/products/${id}`,
      options,
    )
    console.log(response)
    const data = await response.json()
    console.log(data)
    const filteredData = productsList.map(eachItem => {
      if (eachItem.id === id) {
        return {...eachItem, title: data.title}
      }
      return {...eachItem}
    })

    this.setState({productsList: filteredData})
  }

  addProduct = async event => {
    event.preventDefault()
    this.setState(prevState => ({isSaveClicked: !prevState.isSaveClicked}))
    const {addDataForm} = this.state
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(addDataForm),
    }
    const response = await fetch('https://dummyjson.com/products/add', options)
    const data = await response.json()
    console.log(data)
    this.setState(prevState => ({
      productsList: [...prevState.productsList, data],
    }))
  }

  removeFilters = () => {
    this.setState({activeCategoryId: '', searchInput: ''}, this.getProducts)
  }

  addImageUrl = event => {
    this.setState(prevState => ({
      addDataForm: {...prevState.addDataForm, imageurl: event.target.value},
    }))
  }

  addTitle = event => {
    this.setState(prevState => ({
      addDataForm: {...prevState.addDataForm, title: event.target.value},
    }))
  }

  addPrice = event => {
    this.setState(prevState => ({
      addDataForm: {...prevState.addDataForm, price: event.target.value},
    }))
  }

  addCategory = event => {
    this.setState(prevState => ({
      addDataForm: {...prevState.addDataForm, category: event.target.value},
    }))
  }

  onCloseButton = () => {
    this.setState(prevState => ({isSaveClicked: !prevState.isSaveClicked}))
  }

  changeCategory = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="all-products-error"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderProductsListView = () => {
    const {productsList} = this.state
    const shouldShowProductsList = productsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard
              productData={product}
              key={product.id}
              deleteProduct={this.deleteProduct}
              updateProductTitle={this.updateProductTitle}
            />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="TailSpin" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, searchInput, isSaveClicked} = this.state
    const saveText = isSaveClicked ? 'saved' : 'save'
    return (
      <div className="total-products-section">
        <div className="create-button-container">
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
              <button className="create-button" type="button">
                <span>
                  <IoMdAdd className="plus-icon" />
                </span>
                Create
              </button>
            }
          >
            {close => (
              <form className="form-container2" onSubmit={this.addProduct}>
                <input
                  className="input-ele"
                  onChange={this.addImageUrl}
                  placeholder="Enter Image Url"
                />
                <br />
                <input
                  className="input-ele"
                  onChange={this.addTitle}
                  placeholder="Enter Title"
                />
                <br />
                <input
                  className="input-ele"
                  onChange={this.addCategory}
                  placeholder="Enter Category"
                />
                <br />
                <input
                  className="input-ele"
                  onChange={this.addPrice}
                  placeholder="Enter Price"
                />
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
        </div>

        <div className="all-products-section">
          <FiltersGroup
            searchInput={searchInput}
            categoryOptions={categoryOptions}
            changeSearchInput={this.changeSearchInput}
            enterSearchInput={this.enterSearchInput}
            activeCategoryId={activeCategoryId}
            changeCategory={this.changeCategory}
            removeFilters={this.removeFilters}
          />

          {this.renderAllProducts()}
        </div>
      </div>
    )
  }
}

export default Products
