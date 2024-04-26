import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'

const CreateAttributeModal = props => {

    const { open, setOpen } = props
    const [attributeName, setAttributeName] = useState("")
    const [attributeImageable, setAttributeImageable] = useState(false);
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);

    const onClose = () => {
        setOpen(prevState => !prevState)
        setStatus({})
        setAttributeName("")
    }

    const handleAddingAttribute = () => {
        setLoading(true)
        axios.post("/attributes",
            { name: attributeName, imageable: attributeImageable },
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
                setAttributeName("")
                setAttributeImageable(false)
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
                <p className="pageHeading mt-4">Enter Attribute Name: </p>
                <input type="text" className="createFromInputField mt-4 mb-4" onChange={e => setAttributeName(e.target.value)} value={attributeName} />
                {/* <p className="pageHeading mt-4">Imageable? </p> */}
                <input id="imageable" type="checkbox" name="imageable" onChange={() => {setAttributeImageable(!attributeImageable)}} checked={attributeImageable ? 'checked' : ''} />
                <label className="pageHeading ml-2" htmlFor="imageable">Imageable?</label>
                {
                    loading ? (
                        <button className="button button-primary flex items-center mt-4 w-20" disabled style={{ marginLeft: 0 }}> <span className="fas fa-sync-alt mr-2 py-1 animate-spin"></span></button>
                    ) : (
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleAddingAttribute}>Add</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default CreateAttributeModal
