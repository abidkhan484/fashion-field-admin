import React, { useState, useEffect } from 'react'
import { LoaderContext } from 'context/LoaderContext';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment-timezone';
import { Link, useHistory } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar'

import CreateAttributeModal from './CreateAttributeModal'
import UpdateAttributeModal from './UpdateAttributeModal';
import { permission } from 'helper/permission';

const AttributeList = () => {

    const [open, setOpen] = useState(false)
    const { loading, setLoading } = React.useContext(LoaderContext);
    console.log(loading)
    const { token, user } = useSelector((state) => state.auth);
    const [allAttributes, setAllAttributes] = useState([])
    const [attributeValue, setAttributeValue] = useState(null)
    const [updateModal, setUpdateModal] = useState(false)
    const [attributeId, setAttributeId] = useState(null)
    let history = useHistory()

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'products_attributes', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    useEffect(() => {

        if (updateModal == false) {
            if (token !== '') {
                setLoading(true);
                axios.get('/attributes', { headers: { Authorization: token, Accept: 'application/json', } })
                    .then(response => {
                        console.log(response.data);
                        setAllAttributes(response.data);
                        setLoading(false);
                    }).catch(errors => {
                        console.log(errors.response);
                        setLoading(false);
                    })
            }
        }
    }, [token, open, updateModal])

    const handleAddingAttributeValue = (name, id) => {
        console.log(name, id)
        history.push(`/admin/attributes/${id}`, { name: name })
    }

    return (
        <>
            <div className="mt-8 px-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Attributes</h1>
                    <div className="flex">
                        
                        {user?.permissions && (permission(user.permissions, 'products_attributes', 'create') || (user.user_type_id == 1)) ? (
                            <button className="button button-outline-primary px-4" onClick={() => setOpen(prevState => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add a New Attribute
                            </button>
                        ) : '' }
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Attributes</h4>
                            </div>
                            <input className="inputBox" placeholder="Search" />
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader w-1/5">Name</th>
                                    <th className="tableHeader w-1/5">Values</th>
                                    <th className="tableHeader w-1/5">Date</th>
                                    <th className="tableHeader w-1/5">Add Attribute value</th>
                                    <th className="tableHeader w-1/5">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allAttributes.map((item, index) => (
                                    <tr key={index} className="border-b py-4 h-20">
                                        <td className="tableData">{item.name}</td>
                                        <td className="tableData">
                                            {item.values.map((item, index) => (
                                                <p key={index}>{item.value}</p>
                                            ))}
                                        </td>
                                        <td className="tableData"><Moment format="MMM, D YYYY">{item.created_at}</Moment></td>
                                        <td className="tableData">
                                            {user?.permissions && (permission(user.permissions, 'products_attributes', 'create') || (user.user_type_id == 1)) ? (
                                                 <span className="border-2 border-buttonColor bg-buttonColor text-white px-4 py-2 rounded-full cursor-pointer" onClick={() => handleAddingAttributeValue(item.name, item.id)}>Click to add values</span>
                                            ) : '' }
                                           
                                        </td>
                                        <td>
                                            

                                            {user?.permissions && (permission(user.permissions, 'products_attributes', 'update') || (user.user_type_id == 1)) ? (
                                                <i className="fas fa-pen cursor-pointer" onClick={() => { setUpdateModal(prevState => !prevState); setAttributeId(item.id) }}></i>
                                            ) : '' }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <CreateAttributeModal open={open} setOpen={setOpen} />
            <UpdateAttributeModal updateModal={updateModal} setUpdateModal={setUpdateModal} attributeId={attributeId} setAttributeId={setAttributeId} />
        </>
    )
}

export default AttributeList
