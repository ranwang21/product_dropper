import React from 'react'
import { useDropzone } from 'react-dropzone'

const handleOnDrag = (onHandleOpenModal, onHandleDragFile, file) => {
    onHandleOpenModal()
    onHandleDragFile(file)
    console.log(file)
}

export default function DragZone (props) {
    const { onHandleOpenModal, onHandleDragFile } = props
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop: (files) => handleOnDrag(onHandleOpenModal, onHandleDragFile, files[0]) })

    return (
        <section className='container'>
            <div {...getRootProps({ className: 'dropzone disabled' })}>
                <input {...getInputProps()} />
                <p>Drag an image here to create a new product</p>
            </div>
            {/* <aside>
                <h4>Files</h4>
                <ul>{files}</ul>
            </aside> */}
        </section>
    )
}
