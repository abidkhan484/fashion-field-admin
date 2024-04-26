import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

const CreateProductCategoryModal = props => {

    const { open, setOpen, id } = props

    const [productCategory, setProductCategory] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);

    const onClose = () => {
        setOpen(prevState => !prevState)
        setStatus({})
        setPreview(null);
        setImage(null)
        setProductCategory("")
    }

    const handleImage = e => {
        const [file] = e.target.files
        if (file) {
            setPreview(URL.createObjectURL(file))
            setImage(file)
        } else {
            setImage(null)
        }
    }

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    }

    const handleAddingProductCategory = () => {
        setLoading(true)
        const data = new FormData();

        data.append('sub_category_id', id);
        data.append('name', productCategory);
        data.append('thumbnail', image);

        axios.post("/categories/product-categories",
            data,
            {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            })
            .then(response => {
                console.log(response)
                setStatus({
                    type: 'SUCCESS',
                    message: "Value is Added in Product-Category List",
                })
                setProductCategory("")
                setImage(null)
                setPreview(null)
                setLoading(false)
            })
            .catch(errors => {
                console.log(errors)
                setStatus({
                    type: 'DANGER',
                    message: "Please Try again. Network issue has occoured"
                })
                setLoading(false)
            })
    }

    return (
        <Modal open={open} onClose={onClose} blockScroll={false}>
            <div style={{ width: 500 }}>
                <p className="pageHeading mt-4">Enter Product Category Name: </p>
                <input type="text" className="createFromInputField mt-4" onChange={e => setProductCategory(e.target.value)} value={productCategory} />
                {preview ? (
                    <div className="relative w-48 mt-4">
                        <button onClick={() => removeImage()} className="bg-red-600 text-white p-1 rounded-full absolute right-0 mr-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img className="w-full h-auto" src={preview} alt="..." />
                    </div>
                ) : (
                    <>
                        <label htmlFor="file_upload" className="w-48 py-8 flex justify-center border-2 border-dashed mt-4">Select Logo</label>
                        <input id="file_upload" type="file" onChange={e => handleImage(e)} className="hidden" />
                        <p className='text-sm'>Image size: 100x110</p>
                    </>
                )}

                {
                    loading ? (
                        <button className="button button-primary flex items-center mt-4 w-20" disabled style={{ marginLeft: 0 }}> <span className="fas fa-sync-alt animate-spin"></span></button>
                    ) : (
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleAddingProductCategory}>Add</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default CreateProductCategoryModal
