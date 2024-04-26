import React, { useState, useEffect } from 'react'
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import axios from 'axios'
import { useSelector } from "react-redux"
import Alert from 'core/Alert'
import { ImSpinner9 } from "react-icons/im"

const UpdateAttributeModal = props => {
    const { updateModal, setUpdateModal, attributeId, setAttributeId } = props

    const [attributeName, setAttributeName] = useState("")
    const [attributeImageable, setAttributeImageable] = useState(false);
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token } = useSelector(state => state.auth);


    const onClose = () => {
        setUpdateModal(prevState => !prevState)
        setStatus({})
        setAttributeName("")
        setAttributeId(null)
    }

    useEffect(() => {
        if (attributeId != null) {
            setLoading(true)
            axios.get(`/attributes/${attributeId}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                setAttributeName(response.data.name)
                setAttributeImageable(response.data.imageable)
                setLoading(false)
            }).catch(errors => {
                console.log(errors)
            })
        }
    }, [attributeId])

    const handleUpdatingAttribute = () => {
        setLoading(true)
        axios.post(`/attributes/${attributeId}`,
            { name: attributeName, imageable: attributeImageable, _method: "PUT" },
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
                // setAttributeName("")
                // setAttributeImageable(false)
                setLoading(false)
            })
            .catch(errors => {
                setStatus({
                    type: 'DANGER',
                    message: errors.response?.data?.errors?.name[0]
                })
                setLoading(false)
                setAttributeName("")
                console.log(errors.response)
            })
    }


    return (
        <Modal open={updateModal} onClose={onClose} blockScroll={false}>
            <div style={{ width: 500 }}>
                <p className="pageHeading mt-4">Enter New Attribute Name: </p>
                <input type="text" className="createFromInputField mt-4 mb-4" onChange={e => setAttributeName(e.target.value)} value={attributeName} />
                <input id="imageable" type="checkbox" name="imageable" onChange={() => {setAttributeImageable(!attributeImageable)}} checked={attributeImageable ? 'checked' : ''} />
                <label className="pageHeading ml-2" htmlFor="imageable">Imageable?</label>
                {
                    loading ? (
                        <button className="button button-primary flex items-center mt-4 w-20" disabled>
                            <span className="animate-spin">
                                <ImSpinner9 />
                            </span>
                        </button>
                    ) : (
                        <button className="button button-primary mt-4 w-20" style={{ marginLeft: 0 }} onClick={handleUpdatingAttribute}>Update</button>
                    )
                }
                <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" />
            </div>
        </Modal>
    )
}

export default UpdateAttributeModal
