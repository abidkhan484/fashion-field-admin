import React, { useState, useEffect }  from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { permission } from 'helper/permission'


const SubCategoryBannerSlider = () => {
    const { token, user } = useSelector(state => state.auth);
    const [subcategoriesSliders,setsubCategoriesSliders]=useState([])
    const [subcategoriesBanners,setsubCategoriesBanners]=useState([])

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'banner_sub_category', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])
    const fetchSlider = () => {
        axios.get('/subCategorySlider', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log("💥",response.data.subcategorySliders);
            setsubCategoriesSliders(response.data.subcategorySliders);
        }).catch(error => {
            console.log(error.response);
        })
    }

    const fetchBanner = () => {
        axios.get('/subCategoryBanner', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log("💥",response.data.subcategoryBanners);
            setsubCategoriesBanners(response.data.subcategoryBanners);
        }).catch(error => {
            console.log(error.response);
        })
    }

    const handleSliderDelete =(id)=>{
        console.log(id);
        if(!window.confirm('Are you want to do it?'))
            return false;
        if (token != "") {
            axios.delete(`/subCategorySlider/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                fetchSlider()
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }

    const handleBannerDelete =(id)=>{
        console.log(id);
        if(!window.confirm('Are you want to do it?'))
            return false;
        if (token != "") {
            axios.delete(`/subCategoryBanner/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                fetchBanner();
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }

    useEffect(()=>{
        fetchSlider();
        fetchBanner();
    },[token])
    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Sub Category Banners and Sliders</h1>
                <div className="flex">
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Sliders</h4>
                        </div>
                        
                        {user?.permissions && (permission(user.permissions, 'banner_sub_category', 'create') || (user.user_type_id == 1)) ? (
                            <Link to="/admin/subcategoryBanner/add" className="button button-outline-primary w-48">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 buttonText">Add New Slider</span>
                            </Link>
                        ) : ''}
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">

                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/9">SubCategory </th>
                                {/* <th className="tableHeader w-1/9">Type</th> */}
                                <th className="tableHeader w-1/9">Image</th>
                                <th className="tableHeader w-1/9">Link</th>
                                <th className="tableHeader w-1/9 text-center">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {subcategoriesSliders && subcategoriesSliders.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">{item?.subcategory?.name}</p>
                                    </td>
                                    <td>
                                        <img src={item?.image} alt="" className='w-1/2'/>
                                    </td>
                                    <td>
                                        <p className="tableData">{item?.link}</p>
                                    </td>
                                    <td className="">
                                    {user?.permissions && (permission(user.permissions, 'banner_sub_category', 'delete') || (user.user_type_id == 1)) ? (
                                        <div className="flex items-center h-full justify-center">   
                                            <div onClick={() => handleSliderDelete(item?.id)}><i className="fas fa-trash ml-4 cursor-pointer" style={{ color: "red" }}></i></div>
                                        </div>
                                    ) : ''}
                                        

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>   
            </div>




            <div className="card mt-5">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Banners</h4>
                        </div>
                        
                        {user?.permissions && (permission(user.permissions, 'banner_sub_category', 'create') || (user.user_type_id == 1)) ? (
                            <Link to="/admin/subcategoryBanner/addbanner" className="button button-outline-primary w-48">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                <span className="ml-2 buttonText">Add New Banner</span>
                            </Link>
                        ) : ''}
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">

                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/9">SubCategory </th>
                                <th className="tableHeader w-1/9">Type</th>
                                <th className="tableHeader w-1/9">Image</th>
                                <th className="tableHeader w-1/9">Link</th>
                                <th className="tableHeader w-1/9 text-center">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {subcategoriesBanners && subcategoriesBanners.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">{item?.subcategory?.name}</p>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.type}</p>
                                    </td>
                                    <td>
                                        <img src={item.image} alt="" className='w-1/2'/>
                                    </td>
                                    <td>
                                        <p className="tableData">{item.link}</p>
                                    </td>
                                    <td className="">
                                    {user?.permissions && (permission(user.permissions, 'banner_sub_category', 'delete') || (user.user_type_id == 1)) ? (
                                        <div className="flex items-center h-full justify-center">   
                                            <div onClick={() => handleBannerDelete(item.id)}><i className="fas fa-trash ml-4 cursor-pointer" style={{ color: "red" }}></i></div>
                                        </div>
                                    ) : ''}
                                        

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>   
            </div>
        </div>
    )
}

export default SubCategoryBannerSlider
