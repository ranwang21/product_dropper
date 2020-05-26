import React, { Component } from 'react'
import DragZone from './drag-zone'

export default class Header extends Component {
    constructor () {
        super()
        this.state = {
            searchKey: ''
        }

        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this)
    }

    /**
     * When user type in the search bar
     * @param {*} event
     */
    handleSearchKeyChange (event) {
        this.setState({ searchKey: event.target.value }, () => this.props.onHandleSearch(this.state.searchKey))
    }

    render () {
        const { onHandleOpenModal, onHandleDragFile } = this.props
        return (
            <div>
                <input onChange={this.handleSearchKeyChange} value={this.state.searchKey} className='form-control mr-sm-2 mt-4 w-30' type='search' placeholder='Search by the product name' aria-label='Search' />
                <div className='d-flex  mt-3'>
                    <button type='button' className='btn btn-primary' data-toggle='modal' data-target='add-product-modal' onClick={onHandleOpenModal}>Add product</button>
                    <DragZone className='' onHandleOpenModal={onHandleOpenModal} onHandleDragFile={onHandleDragFile} />
                </div>
            </div>
        )
    }
}
