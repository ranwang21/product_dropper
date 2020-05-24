import React, { Component } from 'react'
import Product from './product'

export default class Products extends Component {
    renderProducts (products, onHandleDeleteProduct) {
        return products.map(product => <Product key={product._id} product={product} onHandleDeleteProduct={onHandleDeleteProduct} />)
    }

    render () {
        const { products, onHandleDeleteProduct, newProductImage } = this.props
        return (
            <div className='d-flex pt-3 bd-highlight flex-wrap'>
                {products.length > 0 ? this.renderProducts(products, onHandleDeleteProduct) : <p><b>No products found</b></p>}
            </div>
        )
    }
}
