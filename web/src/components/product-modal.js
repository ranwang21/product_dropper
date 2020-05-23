import React, { Component } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
const awsConfig = require('../../../server/config/awsConfig.json')

// connect modal to the app for screen readers
Modal.setAppElement('#app')

// custom styles for the modal
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
}

const initialState = {
    imageFile: '',
    // default preview image
    preview: 'https://youtube-images-1123.s3.us-east-2.amazonaws.com/default.jpg',
    name: '',
    quantity: '',
    price: '',
    colour: ''
}

export default class ProductModal extends Component {
    constructor () {
        super()
        this.state = {
            imageFile: '',
            // default preview image
            preview: `https://${awsConfig.bucket}.s3.us-east-2.amazonaws.com/default.jpg`,
            name: '',
            quantity: '',
            price: '',
            colour: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleChooseImage = this.handleChooseImage.bind(this)
        this.handleCancle = this.handleCancle.bind(this)
    }

    handleSave () {
        // add product image to aws s3
        this.saveImageToS3()
        this.props.onHandleAddProduct(this.state)
        this.setState(initialState)
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
                        // const fileName = response.data
                        // console.log('filedata', fileName)
                        return true
                    }
                })
        } else {
            // if file not selected throw error
            window.alert('please select a file.')
            return false
        }
    }

    handleCancle () {
        // add product to database then initiate the local state
        this.props.onHandleCloseModal()
        this.setState(initialState, () => console.log(this.state.preview))
    }

    handleChange (event) {
        const value = event.target.value
        this.setState({
            [event.target.name]: value
        })
    }

    renderErrorMessages (errMsg) {
        if (Array.isArray(errMsg) && errMsg.length > 0) {
            return errMsg.map((err, index) => <div key={index} className='alert alert-danger' role='alert'>{err.text}</div>)
        }
    }

    handleOnOpen () {
        console.log('open')
        this.setState({ preview: '' })
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

    render () {
        const { showModal, errMsg } = this.props
        return (
            <div>
                <Modal
                    isOpen={showModal}
                    style={customStyles}
                    contentLabel='Minimal Modal Example'
                >

                    {/* show form validation errors if exits */}
                    {this.renderErrorMessages(errMsg)}

                    <form>
                        <div className='container-fluid text-center'>
                            <div className='text-center'>
                                <img src={this.state.preview} className='rounded mx-auto' alt='...' width='200' height='200' />
                                {/* use a hidden input to receive image file */}
                                <input name='image' onChange={this.handleChooseImage} type='file' ref='upload' style={{ display: 'none' }} />
                            </div>
                            <label>{this.state.imageFile !== '' ? this.state.imageFile.name : null}</label>
                            <div className='alert alert-light mb-0' role='alert'>
                                You can <a href='#' onClick={() => this.refs.upload.click()} className='alert-link m-0'>choose an image</a>. Supported image format: .jpg, .jpeg, .png, .gif.
                            </div>
                            {/* <input type='text' disabled id='image' name='image' onChange={this.handleChange} value={this.state.image} /> */}
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='name' className='col-sm-2 col-form-label'>Name</label>
                            <div className='col-sm-10'>
                                <input type='text' className='form-control' id='name' name='name' onChange={this.handleChange} value={this.state.name} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='quantity' className='col-sm-2 col-form-label'>Quantity</label>
                            <div className='col-sm-10'>
                                <input type='number' className='form-control' id='quantity' name='quantity' onChange={this.handleChange} value={this.state.quantity} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='price' className='col-sm-2 col-form-label'>Price</label>
                            <div className='col-sm-10'>
                                <input type='number' className='form-control' id='Price' name='price' onChange={this.handleChange} value={this.state.price} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='colour' className='col-sm-2 col-form-label'>Colour</label>
                            <div className='col-sm-10'>
                                <input type='text' className='form-control' id='colour' name='colour' onChange={this.handleChange} value={this.state.colour} />
                            </div>
                        </div>

                    </form>

                    <div className='modal-footer'>
                        <button type='button' className='btn btn-primary' onClick={this.handleSave}>Save</button>
                        <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={this.handleCancle}>Cancle</button>
                    </div>
                </Modal>
            </div>
        )
    }
}
