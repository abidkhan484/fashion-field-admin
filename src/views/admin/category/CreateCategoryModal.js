import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

const CreateCategoryModal = props => {

    const { open, setOpen } = props
    const [category, setCategory] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);

    const onClose = () => {
        setOpen(prevState => !prevState)
        setStatus({})
        setCategory("")
    }

    const handleAddingCategory = () => {
        setLoading(true)
        axios.post("/categories",
            { name: category },
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
                    message: "Value is Added in Category List.",
                })
                setLoading(false)
                setCategory("")
            })
            .catch(errors => {
                setStatus({
                    type: 'DANGER',
                    message: "Please Try again. Network issue has occoured"
                })
                setLoading(false)
                setCategory("")
            })
    }

    useEffect(() => {
        console.log(category)
    }, [category])

    return (
        <Modal open={open} onClose={onClose} blockScroll={false}>
            <div style={{ width: 500 }}>
                <p className="pageHeading mt-4">Enter Category Name: </p>
                <input type="text" className="createFromInputField mt-4" onChange={e => setCategory(e.target.value)} value={category} />
                {
                    loading ? (
                        <button className="button button-primary flex items-center mt-4 w-20" disabled style={{ marginLeft: 0 }}> <span className="fas fa-sync-alt animate-spin"></span></button>
                    ) : (
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleAddingCategory}>Add</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default CreateCategoryModal
