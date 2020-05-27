import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

// const renderAdditionalAttribute = product => {
//     if (product.additionalAttribute.additionalAttributeName !== '') {
//         return (
//             <p className='card-text'>
//                 {product.additionalAttribute.additionalAttributeName}:
//                 {product.additionalAttribute.additionalAttribtueValue}
//             </p>
//         )
//     }
// }

export default function Product (props) {
    const { product, onHandleDeleteProduct } = props

    return (
        <div className='card w-25 text-center pt-4'>
            <div>
                <img
                    src={`https://youtube-images-1123.s3.us-east-2.amazonaws.com/${product.image}`}
                    width='200'
                    height='200'
                    alt={product.image}
                />
            </div>
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>Price: {product.price}</p>
                <p className='card-text'>
                    {product.quantity > 0 ? (
                        'Quantity: ' + product.quantity
                    ) : (
                        <b>
                            <i>Out of order</i>
                        </b>
                    )}
                </p>
                <p className='card-text'>Colour: {product.colour}</p>
                {/* {renderAdditionalAttribute(product)} */}
                <button onClick={() => onHandleDeleteProduct(product._id)}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
        </div>
    )
}
