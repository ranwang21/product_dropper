import React, { Component } from 'react'
import axios from 'axios'
import Header from './header'
import Products from './products'
import ProductModal from './product-modal'
import { css } from '@emotion/core'
import BarLoader from 'react-spinners/BarLoader'

// style for loading spinner
const override = css`
  display: block;
  margin: 0 auto;
  border-color: slategrey;
`

export default class ApplicationContainer extends Component {
    constructor () {
        super()
        this.state = {
            products: [],
            showModal: false,
            onSearch: false,
            errMsg: [],
            loading: true
        }

        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleAddProduct = this.handleAddProduct.bind(this)
    }

    handleOpenModal () {
        // clear the form error messages then open the modal
        this.setState({ errMsg: [] })
        this.setState({ showModal: true })
    }

    handleCloseModal () {
        this.setState({ showModal: false })
    }

    handleAddProduct (product) {
        console.log('add product...')
        console.log(product)
        axios.post('http://localhost:5000/add', {
            // add a uuid to the imagefile name to avoid duplicates
            image: product.imageFile.name,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            colour: product.colour
        }).then(res => {
            // form validation, if erros exit, it will be an array, show errors in modal
            if (Array.isArray(res.data)) {
                this.setState({ errMsg: res.data })
            } else {
                this.setState({ loading: true })
                setTimeout(() => {
                    this.fetchProducts()
                    // temporary solution: wait for .8s for image upload on s3
                }, 800)
                this.handleCloseModal()
            }
        })
    }

    fetchProducts () {
        axios.get('http://localhost:5000/products')
            .then(products => this.setState({ products: products.data }))
            .then(() => this.setState({ loading: false }))
    }

    handleDeleteProduct (productId) {
        axios({
            method: 'POST',
            url: `http://localhost:5000/products/${productId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.data.n === 1) {
                // when the deletion is successful on database, update the app state
                this.setState({ products: this.state.products.filter(p => p._id !== productId) })
            }
        })
    }

    componentDidMount () {
        this.fetchProducts()
    }

    render () {
        return (
            <div className='container'>
                <Header onHandleOpenModal={this.handleOpenModal} />

                {this.state.loading
                    ? <BarLoader css={override} height={4} width={100} color='#123abc' loading={this.state.loading} />
                    : <Products products={this.state.products} onHandleDeleteProduct={this.handleDeleteProduct} />}
                <ProductModal errMsg={this.state.errMsg} onHandleCloseModal={this.handleCloseModal} showModal={this.state.showModal} onHandleAddProduct={this.handleAddProduct} />
            </div>
        )
    }
}
