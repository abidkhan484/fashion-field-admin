import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

const UpdateProductCategoryModal = props => {
    const { updateModal, setUpdateModal, productCategoryId, setProductCategoryId } = props


    const [productCategoryName, setProductCategoryName] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const [subCategoryId, setSubCategoryId] = useState(null)

    const { token } = useSelector(state => state.auth);


    const onClose = () => {
        setUpdateModal(prevState => !prevState)
        setProductCategoryName("")
        setStatus({})
        setSubCategoryId(null)
        setImage(null)
        setPreview(null)
        setProductCategoryId(null)
    }

    const removeImage = () => {
        setImage(null);
        setPreview(null);
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

    useEffect(() => {
        if (productCategoryId != null) {
            axios.get(`/categories/product-categories/${productCategoryId}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                setProductCategoryName(response.data.name)
                setSubCategoryId(response.data.sub_category_id)
                setPreview(response.data.thumbnail)
            }).catch(errors => {
                console.log(errors)
            })
        }
    }, [productCategoryId])

    const handleUpdatingProductCategoryName = () => {
        setLoading(true)
        const data = new FormData();

        data.append('name', productCategoryName);
        data.append('sub_category_id', subCategoryId);
        data.append('thumbnail', image);

        axios.post(`/categories/product-categories/${productCategoryId}`,
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
                    message: response.data.message,
                })
                setProductCategoryName("")
                setImage(null)
                setPreview(null)
                setLoading(false)
            })
            .catch(errors => {
                console.log(errors.response)
                setStatus({
                    type: 'DANGER',
                    message: errors.response?.data?.message
                })
                setLoading(false)
            })
    }


    return (
        <Modal open={updateModal} onClose={onClose} blockScroll={false}>
            <div style={{ width: 500 }}>
                <p className="pageHeading mt-4">Enter New Product Category Name: </p>
                <input type="text" className="createFromInputField mt-4" onChange={e => setProductCategoryName(e.target.value)} value={productCategoryName} />
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
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleUpdatingProductCategoryName}>Update</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default UpdateProductCategoryModal