import axios from 'axios';
import Pagination from 'core/Pagination';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';

export default function Users() {

    const [users, setUsers] = React.useState([]);

    const { token, user } = useSelector(state => state.auth)

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'system_user', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchUsers = () => {
        axios.get('/users', {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setUsers(response.data);
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchUsers();
        }
    }, [token]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All System User</h1>
                    <div className="flex">
                        
                        {user?.permissions && (permission(user.permissions, 'system_user', 'create') || (user.user_type_id == 1)) ? (
                                <Link to='/admin/users/add' className="button button-outline-primary px-4">Add New User</Link>
                        ) : '' }
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Orders</h4>
                            </div>
                            {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                            {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader">Name</th>
                                    <th className="tableHeader">Email</th>
                                    <th className="tableHeader">Status</th>
                                    <th className="tableHeader">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((item, index) => (    
                                    <tr key={index} className="border-b py-4 h-20">
                                        <td><p className="tableData uppercase"><span className="font-bold">{item.name}</span></p></td>
                                        <td><p className="tableData">{item.email}</p></td>
                                        <td><p className="tableData">{item.status}</p></td>
                                        <td>
                                            
                                            {user?.permissions && (permission(user.permissions, 'system_user', 'update') || (user.user_type_id == 1)) ? (
                                                    <>
                                                        <Link to={`/admin/users/${item.id}/edit`}><i class="fas fa-edit"></i></Link>
                                                        <Link title='User Permission' to={`/admin/users/${item.id}/permission`} className='ml-2'><i class="fas fa-user-lock"></i></Link>
                                                    </>                                                        
                                                ) : '' }
                                            
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}
