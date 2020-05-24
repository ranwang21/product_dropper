import React from 'react'
import { useDropzone } from 'react-dropzone'

export default function DragZone (props) {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop: files => console.log(files[0]) })

    // const files = acceptedFiles.map(file => (
    //     <li key={file.path}>
    //         {file.path} - {file.size} bytes
    //     </li>
    // ))

    return (
        <div>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            {/* <ul>
                {files}
            </ul> */}
        </div>
    )
}
