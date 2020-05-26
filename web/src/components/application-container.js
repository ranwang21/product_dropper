import React, { Component } from 'react'
import axios from 'axios'
import Header from './header'
import Products from './products'
import ProductModal from './product-modal'
import { css } from '@emotion/core'
import BarLoader from 'react-spinners/BarLoader'

// get aws credentials config
const awsConfig = require('../../../server/config/awsConfig.json')

// style for loading spinner
const override = css`
  display: block;
  margin: 0 auto;
  border-color: slategrey;
`

// initial state on imageFile and preview
const initalStates = {
    imageFile: '',
    preview: `https://${awsConfig.bucket}.s3.us-east-2.amazonaws.com/default.jpg`
}

export default class ApplicationContainer extends Component {
    constructor () {
        super()
        this.state = {
            products: [],
            attributes: {},
            showModal: false,
            onSearch: false,
            searchResults: [],
            errMsg: [],
            loading: true,
            imageFile: '',
            preview: `https://${awsConfig.bucket}.s3.us-east-2.amazonaws.com/default.jpg`
        }

        this.handleOpenModal = this.handleOpenModal.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
        this.handleDeleteProduct = this.handleDeleteProduct.bind(this)
        this.handleAddProduct = this.handleAddProduct.bind(this)
        this.handleChooseImage = this.handleChooseImage.bind(this)
        this.formatImageFileName = this.formatImageFileName.bind(this)
        this.getFileExtension = this.getFileExtension.bind(this)
        this.generateUUID = this.generateUUID.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleDragFile = this.handleDragFile.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.renderProducts = this.renderProducts.bind(this)
        // this.fetchAttributes = this.fetchAttributes.bind(this)
    }

    /**
     * when client type on search bar
     * @param {*} keyword String
     */
    handleSearch (keyword) {
        const products = this.state.products
        const key = keyword.toString().toLowerCase()
        if (key.trim() !== '') {
            this.setState({ onSearch: true })
            this.setState({
                searchResults: products.filter(product => product.name.toString().toLowerCase().includes(keyword))
            })
        } else {
            this.setState({ onSearch: false })
        }
    }

    /**
     * When an is selected on user form
     * @param {*} event event
     */
    handleChooseImage (event) {
        event.stopPropagation()
        event.preventDefault()
        const originalFile = event.target.files[0]
        // change the fileName so it shall be unique
        const newFile = new File([originalFile], this.formatImageFileName(originalFile.name))
        this.setState({
            imageFile: newFile,
            // create a local url to preview the chosen image
            preview: URL.createObjectURL(originalFile)
        })
    }

    /**
     * When an image is dragged into the drop zone
     * @param {*} file File
     */
    handleDragFile (file) {
        const originalFile = file
        // change the fileName so it shall be unique
        const newFile = new File([originalFile], this.formatImageFileName(originalFile.name))
        this.setState({
            imageFile: newFile,
            // create a local url to preview the chosen image
            preview: URL.createObjectURL(originalFile)
        })
    }

    /**
     * use UUID to format the image file
     * @param {*} fileName string
     */
    formatImageFileName (fileName) {
        const extName = this.getFileExtension(fileName)
        return fileName + this.generateUUID() + '.' + extName
    }

    /**
     * get the image file extension
     * @param {*} fileName string
     */
    getFileExtension (fileName) {
        return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName)[0] : undefined
    }

    /**
     * generate a random UUID to the imagefile
     */
    generateUUID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    /**
     * When modal is open
     */
    handleOpenModal () {
        // clear the form error messages then open the modal
        this.setState({ errMsg: [] })
        this.setState({ showModal: true })
    }

    /**
     * when modal is closed - clear imagefile and preview
     */
    handleCloseModal () {
        this.setState({
            showModal: false,
            imageFile: initalStates.imageFile,
            preview: initalStates.preview
        })
    }

    /**
     * when user click on `save` on user form
     * @param {*} product product (model)
     */
    handleSave (product) {
        // add product image to aws s3
        this.saveImageToS3()

        this.handleAddProduct(product)

        // // initialize local state
        this.setState({
            imageFile: initalStates.imageFile,
            preview: initalStates.preview
        })
    }

    /**
     * add product details to MongoDB
     * @param {*} product product (model)
     */
    handleAddProduct (product) {
        const additionalAttributeObj = {
            additionalAttributeName: '',
            additionalAttribtueValue: ''
        }

        if (product.additionalAttributeName !== '' && product.additionalAttribtueValue !== '') {
            additionalAttributeObj.additionalAttributeName = product.additionalAttributeName
            additionalAttributeObj.additionalAttribtueValue = product.additionalAttribtueValue
        }

        axios.post('http://localhost:5000/add', {
            // add a uuid to the imagefile name to avoid duplicates
            image: this.state.imageFile.name,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            colour: product.colour,
            additionalAttribute: additionalAttributeObj
        }).then(res => {
            // form validation, if erros exit, it will be an array, show errors in modal
            if (Array.isArray(res.data)) {
                this.setState({ errMsg: res.data })
            } else {
                this.setState({ loading: true })
                setTimeout(() => {
                    this.fetchProducts()
                    // temporary solution: wait for .8s for image upload on s3
                }, 1000)
                this.handleCloseModal()
            }
        })
    }

    /**
     * upload product image to AWS S3
     */
    saveImageToS3 () {
        const data = new FormData()
        // if file selected
        if (this.state.imageFile) {
            data.append('image', this.state.imageFile, this.state.imageFile.name)
            axios.post('http://localhost:5000/upload-image', data, {
                headers: {
                    accept: 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`
                }
            })
                .then(response => {
                    if (response.status === 200) {
                        const fileName = response.data
                        console.log('filedata', fileName)
                    }
                })
        } else {
            // if file not selected throw error
            window.alert('please select a file.')
        }
    }

    /**
     * Fetch all products from MongoDB
     */
    fetchProducts () {
        axios.get('http://localhost:5000/products')
            .then(products => this.setState({ products: products.data }))
            .then(() => this.setState({ loading: false }))
            .then(() => console.log(this.state.products))
    }

    /**
     * Delete a product
     * @param {*} productId String
     */
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

    /**
     * Fetch all existing attributes from MongoDB. For future use only
     */
    // fetchAttributes () {
    //     axios.get('http://localhost:5000/schemas')
    //         .then(response => this.setState({ attributes: response.data[0] }))
    // }

    componentDidMount () {
        // TODO: Fetch all shemas (backend ok)
        // this.fetchAttributes()
        this.fetchProducts()
    }

    /**
     * Render all products (or search results) on index page
     */
    renderProducts () {
        return this.state.onSearch ? <Products products={this.state.searchResults} onHandleDeleteProduct={this.handleDeleteProduct} />
            : <Products products={this.state.products} onHandleDeleteProduct={this.handleDeleteProduct} />
    }

    render () {
        return (
            <div className='container'>
                <Header onHandleOpenModal={this.handleOpenModal} onHandleDragFile={this.handleDragFile} onHandleSearch={this.handleSearch} />

                {this.state.loading
                    ? <BarLoader css={override} height={4} width={100} color='#123abc' loading={this.state.loading} />
                    : this.renderProducts()}
                <ProductModal errMsg={this.state.errMsg} onHandleCloseModal={this.handleCloseModal} showModal={this.state.showModal} onHandleAddProduct={this.handleAddProduct} onHandleChooseImage={this.handleChooseImage} preview={this.state.preview} onHandleSave={this.handleSave} />
            </div>
        )
    }
}
