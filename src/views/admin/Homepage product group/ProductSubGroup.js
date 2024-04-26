import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { SortableItem, swapArrayPositions } from 'react-sort-list';


const ProductSubGroup = () => {
    const { slug } = useParams()
    const history = useHistory()
    const { token } = useSelector(state => state.auth)
    const [addGroupModal, setAddGroupModal] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)
    const [allGroupsData, setAllGroupsData] = useState([])
    const [editOngoing, setEditOngoing] = useState(false)

    const fetchGroup = () => {
        axios.get(`/groups/${slug}/sub-groups`, {
            headers: {
                Authorization: token,
                Accept: "application/json"
            }
        }).then(response => {
            console.log(response)
            setAllGroupsData(response.data)
        }).catch(errors => {
            console.log(errors.response)
        })
    }

    useEffect(() => {
        if (token != "") {
            fetchGroup()
        }
    }, [token])

    const handleCloseAddingGroupModal = () => {
        setAddGroupModal(false)
        setErrorStatus(null)
        setGroupName("")
        setEditOngoing(false)
    }

    const handleGroupNameSubmit = () => {
        setLoading(true)
        axios.post(`/groups/sub-groups/${slug}`, {
            name: groupName
        }, {
            headers: {
                Authorization: token,
                Accept: "application/json"
            }
        }).then(response => {
            console.log(response)
            setErrorStatus(null)
            setLoading(false)
            setGroupName("")
            setAddGroupModal(false)
            fetchGroup()
        }).catch(errors => {
            console.log(errors.response)
            setErrorStatus(errors.response?.data?.errors)
            setLoading(false)
        })
    }

    const swap = (dragIndex, dropIndex) => {
        let swappedMenus = swapArrayPositions(allGroupsData, dragIndex, dropIndex);

        setAllGroupsData([...swappedMenus]);
    }

    useEffect(() => {
        let sortable = [...allGroupsData]
        if (token != "") {
            axios.post('/groups/sub-groups/order', {
                sortable
            }, {
                headers: {
                    Accept: 'application/json',
                    Authorization: token
                }
            }).then(response => {
                console.log("💥", response.data);
            }).catch(error => {
                console.log(error.response);
            })
        }

    }, [allGroupsData, token])

    const deleteGroup = (id) => {
        axios.delete(`/groups/sub-groups/${id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response)
            fetchGroup()
        }).catch(errors => {
            console.log(errors.response)
        })
    }

    const editGroup = item => {
        setEditOngoing(item.id)
        setGroupName(item.name)
        setAddGroupModal(true)
    }

    const handleGroupNameUpdate = () => {
        setLoading(true)
        axios.put(`/groups/sub-groups/${editOngoing}`, {
            name: groupName,
            group_id: slug
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response)
            setLoading(false)
            fetchGroup()
            setAddGroupModal(false)
            setGroupName("")
            setErrorStatus(null)
        }).catch(errors => {
            console.log(errors.response)
            setLoading(false)
            setErrorStatus(errors.response?.data?.errors)
        })
    }

    return (
        <>
            <Modal open={addGroupModal} onClose={handleCloseAddingGroupModal} center blockScroll>

                <div className='py-6 px-4' style={{ minWidth: 500 }}>

                    <div className="grid grid-cols-12 mb-6">
                        <div className="col-span-4 flex items-center">
                            <label htmlFor="groupName" className="createFromInputLabel">Sub-Group Name</label>
                        </div>
                        <div className="col-span-8">
                            <input type="text" id="groupName" className="createFromInputField" placeholder="Sub-Group Name" value={groupName} onChange={e => setGroupName(e.target.value)} />
                            {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.name}</p>}
                        </div>
                    </div>

                    {
                        (loading) ? (
                            <div className='flex justify-end'>
                                <button className="button button-outline-primary w-1/3" style={{ height: 50 }} disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                            </div>
                        ) : (
                            <>
                                {
                                    editOngoing ? (
                                        <div className='flex justify-end'>
                                            <div className="button button-outline-primary cursor-pointer w-1/3" style={{ height: 50 }} onClick={handleGroupNameUpdate}>
                                                <p>Update</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='flex justify-end'>
                                            <div className="button button-outline-primary cursor-pointer w-1/3" style={{ height: 50 }} onClick={handleGroupNameSubmit}>
                                                <p>Submit</p>
                                            </div>
                                        </div>
                                    )
                                }
                            </>
                        )
                    }

                </div>


            </Modal>

            <div className="px-8 mt-8 mb-8">

                <div className="page-heading">
                    <h1 className="pageHeading">Homepage Product Sub-Group</h1>
                    <div className="flex">
                        <div
                            className="button button-primary px-4 cursor-pointer"
                            onClick={() => setAddGroupModal(true)}
                        >
                            Add Homepage Product Sub-Group
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap">

                    {
                        allGroupsData.map((item, index) => (
                            <div key={index} className="w-full p-2">

                                <SortableItem
                                    items={allGroupsData}
                                    id={item.id}
                                    key={item.id}
                                    swap={swap}
                                >
                                    <div className="card cursor-pointer">
                                        <div className="border-b">
                                            <div className="card-header">
                                                <div>
                                                    <h4 className="pageHeading">{item.name}</h4>
                                                </div>

                                                <div>
                                                    <Link
                                                        to={`/admin/homepage-prouduct-sub-group-product/${item.id}`}
                                                        className="text-sm mr-4"
                                                    >
                                                        <i className="far fa-eye" style={{ color: "green" }}></i>
                                                    </Link>

                                                    <button
                                                        onClick={() => editGroup(item)}
                                                        className="text-sm ml-4"
                                                    >
                                                        <i className="far fa-edit"></i>
                                                    </button>

                                                    <button
                                                        onClick={() => deleteGroup(item.id)}
                                                        className="text-sm text-red-400 ml-4"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </SortableItem>

                            </div>
                        ))
                    }

                </div>

                <div onClick={history.goBack} className="button button-primary px-4 w-1/6 mt-5 cursor-pointer">
                    Go back
                </div>

            </div>
        </>
    );
};

export default ProductSubGroup;
