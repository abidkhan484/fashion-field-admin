import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Alert from 'core/Alert'
import { permission } from 'helper/permission'

const AttributeValueAddPage = () => {
    const { id } = useParams()
    const location = useLocation()
    const { state } = location
    const [value, setValue] = useState(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({})
    const { token, user } = useSelector(state => state.auth);

    // console.log(state)
    // console.log(id)

    let history = useHistory()

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'products_attributes', 'create')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleAddingAttributeValue = () => {
        setLoading(true)
        axios.post(`/attributes/${id}/values`,
            { value: value },
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
                setLoading(false)
                setValue("")
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
        <div className="mt-8 px-8 mb-8">
            <p className="font-Poppins">Add probable options for <span className="font-bold">{state.name}</span> Attribute</p>
            <input type="text" className="inputBox mt-4" style={{ width: "25%" }} onChange={e => setValue(e.target.value)} value={value} onFocus={() => setStatus({})} />

            {
                loading ? (
                    <button className="button button-primary flex items-center mt-4 w-44" disabled style={{ marginLeft: 0 }}> <span className="fas fa-sync-alt mr-2 py-1 animate-spin"></span></button>
                ) : (
                    <button className="button button-primary mt-4 w-44" onClick={handleAddingAttributeValue}>Click to add values</button>
                )
            }
            <Alert status={status?.type} type={status?.type} changeStatus={() => setStatus()} message={status?.message} margin="mt-4" width="w-1/3" />
        </div>
    )
}

export default AttributeValueAddPage
