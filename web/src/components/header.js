import React, { Component } from 'react'

export default class Header extends Component {
    render () {
        const { onHandleOpenModal } = this.props
        return (
            <div>
                <input className='form-control mr-sm-2 mt-4' type='search' placeholder='Search by the product name' aria-label='Search' />
                <div>
                    <button type='button' className='btn btn-primary mt-3' data-toggle='modal' data-target='add-product-modal' onClick={onHandleOpenModal}>Add product</button>
                </div>
            </div>
        )
    }
}
