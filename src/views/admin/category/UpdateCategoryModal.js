import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

import { ImSpinner9 } from "react-icons/im"


const UpdateCategoryModal = props => {

    const { updateModal, setUpdateModal, categoryId, setCategoryId } = props

    const [categoryName, setCategoryName] = useState("")

    const [loading, setLoading] = useState(false)

    const [status, setStatus] = useState({})

    const { token } = useSelector(state => state.auth);

    console.log(categoryId)

    const onClose = () => {
        setUpdateModal(prevState => !prevState)
        setCategoryName("")
        setStatus({})
        setCategoryId(null)
    }

    useEffect(() => {
        console.log(categoryName)
    }, [categoryName])

    useEffect(() => {
        if (categoryId != null) {

            setLoading(true)

            axios.get(`/categories/${categoryId}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                setCategoryName(response.data.name)

                setLoading(false)

            }).catch(errors => {
                console.log(errors)
            })
        }
    }, [categoryId])

    const handleUpdatingCategoryName = () => {
        setLoading(true)
        axios.post(`/categories/${categoryId}`,
            { name: categoryName }, {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setStatus({
                type: 'SUCCESS',
                message: response.data.message,
            })
            setCategoryName("")
            setLoading(false)
        }).catch(errors => {
            console.log(errors.response?.data?.errors?.name[0])
            setStatus({
                type: 'DANGER',
                message: errors.response?.data?.errors?.name[0],
            })
            setLoading(false)
        })
    }


    return (
        <Modal open={updateModal} onClose={onClose} blockScroll={false}>
            <div style={{ width: 500 }}>
                <p className="pageHeading mt-4">Enter New Category Name: </p>
                <input type="text" className="createFromInputField mt-4" onChange={e => setCategoryName(e.target.value)} value={categoryName} />
                {
                    loading ? (

                        <button className="button button-primary flex items-center mt-4 w-20" disabled>
                            <span className="animate-spin">
                                <ImSpinner9 />
                            </span>
                        </button>

                    ) : (
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleUpdatingCategoryName}>Update</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default UpdateCategoryModal

// onClick={handleAddingCategory}