import React, { Component } from 'react'
import Modal from 'react-modal'

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
    name: 'product ' + Date.now(),
    quantity: '1',
    price: '1',
    colour: 'white'
}

export default class ProductModal extends Component {
    constructor () {
        super()
        this.state = {
            name: 'product ' + Date.now(),
            quantity: '1',
            price: '1',
            colour: 'white',
            additionalAttributes: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleModalSave = this.handleModalSave.bind(this)
        this.handleCancle = this.handleCancle.bind(this)
        this.handleAddMoreField = this.handleAddMoreField.bind(this)
        this.renderAdditionalFields = this.renderAdditionalFields.bind(this)
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
        this.setState({
            additionalFields: [],
            preview: ''
        })
    }

    handleModalSave () {
        const product = {
            name: this.state.name,
            quantity: this.state.quantity,
            price: this.state.price,
            colour: this.state.colour
        }
        this.props.onHandleSave(product)
        this.setState(initialState)
    }

    /**
     * add more field to the form when click add more field button
     */
    handleAddMoreField () {
        this.setState({ additionalAttributes: this.state.additionalAttributes.push(`input+${Date.now}`) }, () => console.log(this.state.additionalAttributes))
    }

    /**
     * render additional fields
     */
    renderAdditionalFields () {
        if (this.state.additionalAttributes.length > 0) {
            this.state.additionalAttributes.map(field => {
                return (
                    <>
                        <label htmlFor='colour' className='col-sm-2 col-form-label'>Additional</label>
                        <div className='col-sm-10'>
                            <input type='text' className='form-control' id='colour' name='colour' />
                        </div>
                    </>
                )
            })
        }
    }

    render () {
        const { showModal, errMsg, onHandleChooseImage, preview } = this.props
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
                                <img src={preview} className='rounded mx-auto' alt='...' width='200' height='200' />
                                {/* use a hidden input to receive image file */}
                                <input name='image' onChange={onHandleChooseImage} type='file' ref='upload' style={{ display: 'none' }} />
                            </div>
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
                                <input min='0' type='number' className='form-control' id='quantity' name='quantity' onChange={this.handleChange} value={this.state.quantity} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='price' className='col-sm-2 col-form-label'>Price ($)</label>
                            <div className='col-sm-10'>
                                <input min='0' type='number' className='form-control' id='Price' name='price' onChange={this.handleChange} value={this.state.price} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label htmlFor='colour' className='col-sm-2 col-form-label'>Colour</label>
                            <div className='col-sm-10'>
                                <input type='text' className='form-control' id='colour' name='colour' onChange={this.handleChange} value={this.state.colour} />
                            </div>
                        </div>

                        <div className='form-group row'>
                            {this.renderAdditionalFields()}
                        </div>

                    </form>

                    <div className='modal-footer'>
                        <button type='button' className='btn btn-success' onClick={this.handleAddMoreField}>Add Attribute</button>
                        <button type='button' className='btn btn-primary' onClick={this.handleModalSave}>Save</button>
                        <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={this.handleCancle}>Cancle</button>
                    </div>
                </Modal>
            </div>
        )
    }
}
