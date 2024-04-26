import axios from 'axios';
import { LoaderContext } from 'context/LoaderContext';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Moment from 'react-moment';
import 'moment-timezone';

import CreateProductCategoryModal from './CreateProductCategoryModal';
import Pagination from 'core/Pagination';

import { Link, useParams, useHistory } from 'react-router-dom';


import { AiFillDelete } from "react-icons/ai"

import UpdateProductCategoryModal from './UpdateProductCategoryModal';

import { permission } from 'helper/permission';

export default function ProductCategory() {

    const { loading, setLoading } = React.useContext(LoaderContext);
    const { token, user } = useSelector((state) => state.auth);

    const [open, setOpen] = useState(false)
    const [categories, setCategories] = React.useState([]);

    const [updateModal, setUpdateModal] = useState(false)
    const [productCategoryId, setProductCategoryId] = useState(null)

    const [productCategoryDelete, setProductCategoryDelete] = useState(false)


    const { id } = useParams();

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'products_category', 'access')) && (user.user_type_id != 1))
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

        if (updateModal == false && open == false && productCategoryDelete == false) {
            if (token !== '') {
                setLoading(true);
                axios.get(`/categories/sub-categories/${id}`, { headers: { Authorization: token } })
                    .then(response => {
                        console.log(response);
                        setCategories(response.data.product_category);
                        setLoading(false);
                    }).catch(errors => {
                        console.log(errors.response);
                        setLoading(false);
                    })
            }
        }



    }, [token, open, updateModal, productCategoryDelete])

    const handleProductCategoryDelete = (id) => {
        setProductCategoryDelete(true)
        axios.post(`/categories/product-categories/${id}`, { _method: "DELETE" }, {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setProductCategoryDelete(false)
        }).catch(errors => {
            console.log(errors.response)
        })
    }

    return (
        <>
            <div className="mt-8 px-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Product-Categories</h1>
                    <div className="flex">
                        
                        {user?.permissions && (permission(user.permissions, 'products_category', 'create') || (user.user_type_id == 1)) ? (
                            <button className="button button-outline-primary px-4" onClick={() => setOpen(prevState => !prevState)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Add New Product-Category
                            </button>
                    ) : '' }
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Product-Categories</h4>
                            </div>
                            <input className="inputBox" placeholder="Search" />
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader w-1/5">Name</th>
                                    <th className="tableHeader w-1/5">Slug</th>
                                    <th className="tableHeader w-1/5">Date</th>
                                    <th className="tableHeader w-1/5">Status</th>
                                    <th className="tableHeader w-1/5">Action</th>
                                </tr>
                            </thead>
                            <tbody>



                                {categories?.map((item, index) => (

                                    <tr className="border-b py-4 h-20" key={index}>
                                        <td>
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
                                        </td>
                                        <td className="tableData">{item.slug}</td>
                                        <td className="tableData"><Moment format="MMM, D YYYY">{item.created_at}</Moment></td>
                                        <td>
                                            {
                                                item.active ? <span className="activeButtonView">Active</span> : <span className="deActiveButtonView">Deactive</span>
                                            }
                                        </td>
                                        <td>
                                            <div className="flex">
                                            {user?.permissions && (permission(user.permissions, 'products_category', 'update') || (user.user_type_id == 1)) ? (
                                                <i className="fas fa-pen cursor-pointer" onClick={() => { setUpdateModal(prevState => !prevState); setProductCategoryId(item.id) }}></i>
                                            ) : '' }
                                            {user?.permissions && (permission(user.permissions, 'products_category', 'delete') || (user.user_type_id == 1)) ? (
                                                <AiFillDelete className="ml-4 cursor-pointer" color="red" onClick={() => handleProductCategoryDelete(item.id)} />
                                            ) : '' }
                                                
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
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
            <CreateProductCategoryModal open={open} setOpen={setOpen} id={id} />
            <UpdateProductCategoryModal updateModal={updateModal} setUpdateModal={setUpdateModal} productCategoryId={productCategoryId} setProductCategoryId={setProductCategoryId} />
        </>
    )
}

