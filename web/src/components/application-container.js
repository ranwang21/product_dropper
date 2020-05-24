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

const initalStates = {
    imageFile: '',
    preview: `https://${awsConfig.bucket}.s3.us-east-2.amazonaws.com/default.jpg`
}

export default class ApplicationContainer extends Component {
    constructor () {
        super()
        this.state = {
            products: [],
            showModal: false,
            onSearch: false,
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
    }

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

    formatImageFileName (fileName) {
        const extName = this.getFileExtension(fileName)
        return fileName + this.generateUUID() + '.' + extName
    }

    getFileExtension (fileName) {
        return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName)[0] : undefined
    }

    generateUUID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    handleOpenModal () {
        // clear the form error messages then open the modal
        this.setState({ errMsg: [] })
        this.setState({ showModal: true })
    }

    handleCloseModal () {
        this.setState({ showModal: false })
    }

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

    handleAddProduct (product) {
        console.log('add product...')
        console.log(product)
        axios.post('http://localhost:5000/add', {
            // add a uuid to the imagefile name to avoid duplicates
            image: this.state.imageFile.name,
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
                <ProductModal errMsg={this.state.errMsg} onHandleCloseModal={this.handleCloseModal} showModal={this.state.showModal} onHandleAddProduct={this.handleAddProduct} onHandleChooseImage={this.handleChooseImage} preview={this.state.preview} onHandleSave={this.handleSave} />
            </div>
        )
    }
}
