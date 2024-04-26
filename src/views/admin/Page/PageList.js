import React from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';

const PageList = () => {

    const { token, user } = useSelector(state => state.auth)

    const [pages, setPages] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'pages', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchPages = () => {
        axios.get('/pages', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log("💥",response.data);
            setPages(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }

    const handlePageDelete = (id)=>{
        if(!window.confirm('Are you want to do it?'))
            return false;
        if (token != "") {
            axios.delete(`/pages/${id}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response)
                fetchPages()
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchPages();
        }
    }, [token]);



    return (
        <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
            <h1 className="pageHeading">Manage Pages</h1>
            <div className="flex">
                
                {user?.permissions && (permission(user.permissions, 'pages', 'create') || (user.user_type_id == 1)) ? (
                        <Link to='/admin/page/add' className="button button-outline-primary px-4">Add New Page</Link>
                    ) : '' }
            </div>
        </div>

        <div className="w-full">
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Page List</h4>
                        </div>
                     
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full overflow-x-scroll">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b h-12">
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                   
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages?.map((item, index) => (
                                    <tr key={index} className="h-12 border-b">
                                    <td><p className="">{item.id}</p></td>
                                        <td><p className="">{item.name}</p></td>
                                        {/* <td >{item.description}</td> */}
                                        
                                        <td>
                                            {item.status ==='publish' ? (
                                                <span className="text-sm bg-green-300 px-1 rounded-full">Published</span>
                                            ) : (
                                                <span className="text-sm bg-blue-300 px-1 rounded-full">Draft</span>
                                            )}
                                        </td>
                                        <td>
                                          
                                            

                                            {user?.permissions && (permission(user.permissions, 'pages', 'update') || (user.user_type_id == 1)) ? (
                                                <Link to={`/admin/page/${item.id}/edit`} className="text-sm bg-green-600 text-white mx-2 px-2 py-1 rounded"><i className="fas fa-edit"></i></Link>
                                            ) : '' }

                                            

                                            {user?.permissions && (permission(user.permissions, 'pages', 'delete') || (user.user_type_id == 1)) ? (
                                                <button onClick={() => handlePageDelete(item.id)}><i className="fas fa-trash ml-4 cursor-pointer" style={{ color: "red" }}></i></button>
                                            ) : '' }
                                        </td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                {/* <div className="flex flex-col justify-between md:flex-row items-center w-full">
                    {reviews && <p className="font-Poppins font-normal text-sm">Showing <b>{reviews.from}-{reviews.to}</b> from <b>{reviews.total}</b> data</p>}
                   

                    <div className="flex items-center">
                        {reviews && <Pagination sellers={reviews} setUpdate={updatePage} />}
                    </div>
                </div> */}
            </div>
            </div>
        </div>
    </div>
    )
}

export default PageList
