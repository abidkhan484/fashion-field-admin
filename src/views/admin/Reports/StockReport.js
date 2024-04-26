import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import { ImSpinner9 } from "react-icons/im"

const StockReport = () => {

    const { token } = useSelector((state) => state.auth);

    const [stores, setStores] = useState([]);
    const [storeValue, setStorevalue] = useState(null)
    const [categories, setCategories] = useState([]);
    const [categoryValue, setCategoryValue] = useState(null)
    const [subCategoryOptions, setSubCategoryOptions] = useState([])
    const [subCategoryValue, setSubCategoryValue] = useState(null)
    const [productCategoryOptions, setProductCategoryOptions] = useState([])
    const [productCategoryValue, setProductCategoryValue] = useState(null)

    const [stockReportPreview, setStockReportPreview] = useState([])

    const [loading, setLoading] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)

    useEffect(() => {
        if (token != "") {
            axios.get("/categories", {
                headers: {
                    Authorization: token,
                    Accept: "application/json"
                },
            }).then((response) => {
                setCategories([]);
                setCategories(prevState => [...prevState, { value: 'all_category', label: 'All Categories' }]);
                response?.data?.map(item => {
                    setCategories(prevState => [...prevState, { value: item.id, label: item.name }])
                })
            }).catch((errors) => {
                console.log(errors);
            });

            axios.get('stores/all', {
                headers: {
                    Authorization: token,
                    Accept: "application/json"
                },
            }).then(response => {
                setStores([]);
                setStores(prevState => [...prevState, { value: 'all_store', label: 'All Stores' }]);

                response?.data?.map(item => {
                    setStores(prevState => [...prevState, { value: item.id, label: item.name }])
                })
            }).catch(errors => {
                console.log(errors.response)
            })
        }

    }, [token])

    useEffect(() => {
        if (categoryValue != null) {
            axios.get(`/products/sub-categories/${categoryValue?.value}`, {
                headers: {
                    Authorization: token,
                    Accept: "application/json"
                },
            }).then(response => {
                setSubCategoryOptions([]);
                response?.data?.map(item => {
                    setSubCategoryOptions(prevState => [...prevState, { value: item.id, label: item.name }]);
                })
            }).catch(errors => {
                console.log(errors.response)
                setSubCategoryOptions([]);
                setProductCategoryOptions([])
            })
        } else {
            setSubCategoryOptions([]);
            // setSubCategoryValue(null)
            setProductCategoryOptions([])
            // setProductCategoryValue(null)
        }

    }, [categoryValue])

    useEffect(() => {
        if (subCategoryValue != null) {
            axios.get(`products/product-categories/${subCategoryValue?.value}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            }).then(response => {
                setProductCategoryOptions([]);
                response?.data?.map(item => {
                    setProductCategoryOptions(prevState => [...prevState, { value: item.id, label: item.name }]);
                })
            })
        } else {
            setProductCategoryOptions([])
            // setProductCategoryValue(null)
        }
    }, [subCategoryValue])

    const exportSubmitHandler = () => {
        setLoading(true)
        let formData = new FormData();

        formData.append('store_id', storeValue?.value ? storeValue?.value : "");
        formData.append('category_id', categoryValue?.value ? categoryValue?.value : "");
        formData.append('sub_category_id', subCategoryValue?.value ? subCategoryValue?.value : "")
        formData.append('product_category_id', productCategoryValue?.value ? productCategoryValue?.value : "")


        axios.post('/response/stock', formData, {
            headers: {
                Authorization: token
            },
        }).then(response => {
            console.log(response)
            setStockReportPreview(response.data)
            setLoading(false)
            setErrorStatus(null)
        }).catch(errors => {
            console.log(errors.response)
            setErrorStatus(errors.response?.data?.errors)
            setLoading(false)
        })
    }

    const downloadStockReport = () => {
        setLoading(true)
        let formData = new FormData();

        formData.append('store_id', storeValue?.value ? storeValue?.value : "");
        formData.append('category_id', categoryValue?.value ? categoryValue?.value : "");
        formData.append('sub_category_id', subCategoryValue?.value ? subCategoryValue?.value : "")
        formData.append('product_category_id', productCategoryValue?.value ? productCategoryValue?.value : "")


        axios.post('/report/stock', formData, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            console.log(response)
            window.location.replace(response.data.url)
            setLoading(false)
        }).catch(errors => {
            console.log(errors.response)
            setLoading(false)
        })
    }

    useEffect(() => {
        console.log(categoryValue)
        console.log(subCategoryValue)
        console.log(productCategoryValue)
    }, [categoryValue, subCategoryValue, productCategoryValue])


    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">
                        Stock Report
                    </h1>
                    <div className="flex"></div>
                </div>
            </div>

            <div className='flex -m-1'>

                <div className='w-full mx-4'>

                    <div className='card'>

                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Export Stocks Report</h4>
                                </div>
                            </div>
                        </div>

                        <div className='card-body' style={{ minHeight: '600px' }}>

                            <div className='flex flex-wrap'>

                                <div className='w-1/5 mx-1'>
                                    <label>Select Store</label>
                                    <Select options={stores} onChange={option => setStorevalue(option)} value={storeValue} isClearable={true} />
                                    {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.store_id}</p>} */}
                                </div>

                                <div className='w-1/5 mx-1'>
                                    <label>Select Category</label>
                                    <Select options={categories} onChange={option => { setCategoryValue(option); setSubCategoryValue(null); setProductCategoryValue(null) }} value={categoryValue} isClearable={true} />
                                    {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.store_id}</p>} */}
                                </div>

                                <div className='w-1/5 mx-1'>
                                    <label>Select Sub-Category</label>
                                    <Select options={subCategoryOptions} onChange={option => { setSubCategoryValue(option); setProductCategoryValue(null) }} value={subCategoryValue} isClearable={true} />
                                    {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.store_id}</p>} */}
                                </div>

                                <div className='w-1/5 mx-1'>
                                    <label>Select Product-Category</label>
                                    <Select options={productCategoryOptions} onChange={option => setProductCategoryValue(option)} value={productCategoryValue} isClearable={true} />
                                    {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.store_id}</p>} */}
                                </div>

                                <div className='w-full mx-1 pt-2 float-right'>
                                    {
                                        loading ? (
                                            <button className='float-right bg-blue-600 px-4 py-2 rounded text-white mr-2'>
                                                <ImSpinner9 className='animate-spin' />
                                            </button>
                                        ) : (
                                            <button onClick={exportSubmitHandler} className='float-right bg-blue-600 px-4 py-2 rounded text-white mr-2'>
                                                Submit
                                            </button>
                                        )
                                    }
                                </div>

                                <table className="w-full table-fixed mt-10">

                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader text-center">SL. No.</th>
                                            <th className="tableHeader text-center">Style Number</th>
                                            <th className="tableHeader text-center">Product Name</th>
                                            <th className="tableHeader text-center">Opening Stock</th>
                                            <th className="tableHeader text-center">Opening Total Stock</th>
                                            <th className="tableHeader text-center">Current Stock</th>
                                            <th className="tableHeader text-center">Current Total Stock</th>
                                            <th className="tableHeader text-center">Sold Quantity</th>
                                            <th className="tableHeader text-center">Sold Total Quantity</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            stockReportPreview.map((item, index) => (
                                                <tr key={index} className="border-b py-4 h-20">

                                                    <td>
                                                        <p className='text-center'>{index + 1}</p>
                                                    </td>

                                                    <td>
                                                        <p className='text-center'>{item.STYLE}</p>
                                                    </td>

                                                    <td>
                                                        <p className='text-center'>{item.NAME}</p>
                                                    </td>

                                                    <td>
                                                        {
                                                            item.INITIAL_STOCK ? Object.entries(item.INITIAL_STOCK).map(([key, value], index) => (
                                                                <p className='text-center' key={index}>{key} : {value}</p>
                                                            )) : <p className='text-center'>0</p>
                                                        }
                                                    </td>

                                                    <td>
                                                        <p className='text-center'>{item.Initial_Total_Stock}</p>
                                                    </td>

                                                    <td>
                                                        {
                                                            item.CURRENT_STOCK ? Object.entries(item.CURRENT_STOCK).map(([key, value], index) => (
                                                                <p className='text-center' key={index}>{key} : {value}</p>
                                                            )) : <p className='text-center'>0</p>
                                                        }
                                                    </td>

                                                    <td>
                                                        <p className='text-center'>{item.Current_Total_Stock}</p>
                                                    </td>

                                                    <td>
                                                        {
                                                            item.SOLD ? Object.entries(item.SOLD).map(([key, value], index) => (
                                                                <p className='text-center' key={index}>{key} : {value}</p>
                                                            )) : <p className='text-center'>0</p>
                                                        }
                                                    </td>

                                                    <td>
                                                        <p className='text-center'>{item.Sold_Total_Stock}</p>
                                                    </td>

                                                </tr>
                                            ))
                                        }
                                    </tbody>

                                </table>

                                {
                                    stockReportPreview.length > 0 && (
                                        <div className='w-full mx-1 pt-2 float-right mt-10'>
                                            {
                                                loading ? (
                                                    <button className='float-right bg-blue-600 px-4 py-2 rounded text-white mr-2'>
                                                        <ImSpinner9 className='animate-spin' />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={downloadStockReport}
                                                        className='float-right bg-blue-600 px-4 py-2 rounded text-white'>Download
                                                    </button>
                                                )
                                            }
                                        </div>
                                    )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default StockReport