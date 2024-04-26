import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { SortableItem, swapArrayPositions } from 'react-sort-list';

const ProductSubGroupProduct = () => {
    const { slug } = useParams()
    const history = useHistory()
    const { token } = useSelector(state => state.auth)
    const [addGroupModal, setAddGroupModal] = useState(false)
    const [groupName, setGroupName] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)
    const [allGroupsData, setAllGroupsData] = useState([])
    const [editOngoing, setEditOngoing] = useState(false)

    const [searchValue, setSearchValue] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [specficProduct, setSpecficProduct] = useState(null)

    const fetchGroup = () => {
        axios.get(`/groups/sub-groups/${slug}/products`, {
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

    const swap = (dragIndex, dropIndex) => {
        let swappedMenus = swapArrayPositions(allGroupsData, dragIndex, dropIndex);

        setAllGroupsData([...swappedMenus]);
    }

    useEffect(() => {
        let sortable = [...allGroupsData]
        if (token != "") {
            axios.post('/groups/sub-group-products/order', {
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
        axios.delete(`/groups/sub-group-products/${id}`, {
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


    useEffect(() => {

        if (token != "") {
            axios.get(`/order-create/products?search=${searchValue}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                // console.log(response)
                setSearchResult(response?.data?.data)
            }).catch(errors => {
                console.log(errors.response)
            })
        }

    }, [searchValue, token])

    const handleSelectingProduct = id => {
        setSearchValue("")
        const product = searchResult.filter(item => item.id == id)
        setSpecficProduct(product[0])
    }

    useEffect(() => {
        console.log(specficProduct)
        if (specficProduct != null) {
            setLoading(true)
            axios.post(`/groups/sub-group-products/${slug}`, {
                product_id: specficProduct.id
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
    }, [specficProduct])

    return (
        <div className="px-8 mt-8 mb-8" style={{ minHeight: 600 }}>

            <div className="flex flex-col">
                <h1 className="pageHeading">Homepage Product Sub-Group Product</h1>

                <p className='font-bold mb-6'>Find Products</p>

                <div className='flex flex-col relative'>
                    <input type="text" placeholder="Search Product...." className="h-12 w-full px-7 border-2 focus:outline-none rounded" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                    <div className={`container mx-auto px-4 bg-white h-80 overflow-y-auto shadow-lg absolute top-12 ${searchValue.length > 2 ? 'visible' : 'hidden'}`}>
                        {
                            searchResult.map((item, index) => (
                                <div className='flex h-32 mt-6 mb-6 cursor-pointer' onClick={() => handleSelectingProduct(item.id)}>
                                    <img src={item.thumbnail} className='h-full w-32' />
                                    <div className='ml-8'>
                                        <p>{item.name}</p>
                                        <p>SKU: {item.SKU}</p>
                                        <p>Price: {item.selling_price}</p>
                                    </div>
                                </div>
                            ))
                        }
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
                                        <div className="card-header items-center">
                                            <div className='flex'>
                                                <div className='mr-4'>
                                                    <img src={item?.product?.thumbnail} width={100} height={100} />
                                                </div>
                                                <div className='flex flex-col'>
                                                    <h4 className="pageHeading">{item?.product?.name}</h4>
                                                    <h4 className="pageHeading">Selling Price: {item?.product?.selling_price}</h4>
                                                    <h4 className="pageHeading">SKU: {item?.product?.SKU}</h4>
                                                </div>
                                            </div>

                                            <div>

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
    );
};

export default ProductSubGroupProduct;
