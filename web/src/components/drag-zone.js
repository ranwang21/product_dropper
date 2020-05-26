import React, {useMemo} from 'react'
import { useDropzone } from 'react-dropzone'

const handleOnDrag = (onHandleOpenModal, onHandleDragFile, file) => {
    onHandleOpenModal()
    onHandleDragFile(file)
    console.log(file)
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
}

const activeStyle = {
    borderColor: '#2196f3'
}

const acceptStyle = {
    borderColor: '#00e676'
}

const rejectStyle = {
    borderColor: '#ff1744'
}

export default function DragZone (props) {
    // get props
    const { onHandleOpenModal, onHandleDragFile } = props
    // drag file, then call the handleOnDrag function with the dragged file as param
    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ onDrop: (files) => handleOnDrag(onHandleOpenModal, onHandleDragFile, files[0]), accept: 'image/*' })

    // use style
    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);
    return (
        <section className='container mr-0'>
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag an image here or click to create a new product</p>
            </div>
        </section>
    )
}
