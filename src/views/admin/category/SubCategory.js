import axios from 'axios';
import { LoaderContext } from 'context/LoaderContext';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';
import Pagination from 'core/Pagination';
import { permission } from 'helper/permission';

import { Link, useParams, useHistory } from 'react-router-dom';

import CreateSubCategoryModal from './CreateSubCategoryModal';
import UpdateSubCategoryModal from './UpdateSubCategoryModal';

import { AiFillDelete } from "react-icons/ai"

import { SortableItem, swapArrayPositions } from "react-sort-list";


export default function SubCategory() {

    const { loading, setLoading } = React.useContext(LoaderContext);
    const { token, user } = useSelector((state) => state.auth);

    const [categories, setCategories] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [updateModal, setUpdateModal] = useState(false)
    const [subCategoryId, setSubCategoryId] = useState(null)

    const [subCategoryDelete, setSubCategoryDelete] = useState(false)

    useEffect(() => {
        console.log(categories)
    }, [categories])


    const { id } = useParams();

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (!(permission(user.permissions, 'products_category', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const updatePage = (url) => {
        setLoading(true);
        axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setCategories(response.data)
            setLoading(false);
        })
    }

    React.useEffect(() => {

        if (updateModal == false && open == false && subCategoryDelete == false) {
            if (token !== '') {
                setLoading(true);
                axios.get(`/categories/${id}`, { headers: { Authorization: token } })
                    .then(response => {
                        console.log(response);
                        setCategories(response.data.sub_category);
                        setLoading(false);
                    }).catch(errors => {
                        console.log(errors.response);
                        setLoading(false);
                    })
            }
        }



    }, [token, open, updateModal, subCategoryDelete])

    const handleSubCategoryDelete = (id) => {
        setSubCategoryDelete(true)
        axios.post(`/categories/sub-categories/${id}`, { _method: "DELETE" }, {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setSubCategoryDelete(false)
        }).catch(errors => {
            console.log(errors.response)
        })
    }

    const swap = (dragIndex, dropIndex) => {
        let swappedMenus = swapArrayPositions(categories, dragIndex, dropIndex);

        setCategories([...swappedMenus]);
    };

    React.useEffect(() => {
        let sortable = [...categories]
        axios.post('/categories/sub-categories/order/update', {
          sortable
        }, {
            headers: {
              Accept: 'application/json',
              Authorization: token
            }
        }).then(response => {
            console.log("💥",response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }, [categories])


    return (
        <>
            <div className="mt-8 px-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Sub-Categories</h1>
                    <div className="flex">
                        {user?.permissions && (permission(user.permissions, 'products_category', 'create') || (user.user_type_id == 1)) ? (
                            <button className="button button-outline-primary px-4" onClick={() => setOpen(prevState => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Sub-Category
                            </button>
                        ) : ''}

                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Sub-Categories</h4>
                            </div>
                            <input className="inputBox" placeholder="Search" />
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto sub-category">
                        <div className='grid grid-cols-6 border-b py-4 h-20'>
                            <p className="tableHeader">Name</p>
                            <p className="tableHeader">Slug</p>
                            <p className="tableHeader">Product Categories</p>
                            <p className="tableHeader">Date</p>
                            <p className="tableHeader">Status</p>
                            <p className="tableHeader">Action</p>

                        </div>

                        {
                            categories?.map((item, index) => (
                                <SortableItem
                                    items={categories}
                                    id={item.id}
                                    key={item.id}
                                    swap={swap}
                                    className="w-full"
                                >
                                    <div className='grid grid-cols-6 border-b py-4 h-20' key={index}>
                                        <div>
                                            <div className="flex items-center">
                                                {(item.thumbnail) ? (
                                                    <>
                                                        <img className="w-10 h-auto" alt="..."
                                                            src={item.thumbnail}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="w-10 h-10 bg-gray-200 rounded-full"></span>
                                                    </>
                                                )}

                                                <div className="ml-2">
                                                    <h3 className="tableData">{item.name}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tableData"><Link to={`sub-category/${item.id}`}>{item.slug}</Link></div>

                                        <div className="tableData">{item.product_category.length}</div>

                                        <div className="tableData"><Moment format="MMM, D YYYY">{item.created_at}</Moment></div>

                                        <div>
                                            {
                                                item.active ? <span className="activeButtonView">Active</span> : <span className="deActiveButtonView">Deactive</span>
                                            }
                                        </div>

                                        <div>

                                            <div className="flex">
                                                {user?.permissions && (permission(user.permissions, 'products_category', 'update') || (user.user_type_id == 1)) ? (
                                                    <i className="fas fa-pen cursor-pointer" onClick={() => { setUpdateModal(prevState => !prevState); setSubCategoryId(item.id) }}></i>
                                                ) : ''}

                                                {user?.permissions && (permission(user.permissions, 'products_category', 'delete') || (user.user_type_id == 1)) ? (
                                                    <AiFillDelete className="ml-4 cursor-pointer" color="red" onClick={() => handleSubCategoryDelete(item.id)} />
                                                ) : ''}



                                            </div>

                                        </div>
                                    </div>
                                </SortableItem>
                            ))
                        }

                    </div>
                    {/* <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            <p>Showing <b>{categories.from}-{categories.to}</b> from <b>{categories.total}</b> data</p>

                            <div className="flex items-center">
                                <Pagination sellers={categories} setUpdate={updatePage} />
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            <CreateSubCategoryModal open={open} setOpen={setOpen} id={id} />
            <UpdateSubCategoryModal updateModal={updateModal} setUpdateModal={setUpdateModal} subCategoryId={subCategoryId} setSubCategoryId={setSubCategoryId} />
        </>
    )
}
