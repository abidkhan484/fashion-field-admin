import React from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';
const Couriers = () => {

    const { token, user } = useSelector(state => state.auth)

    const [couriers, setCouriers] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'couriers', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchCouriers = () => {
        axios.get('/couriers', {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            setCouriers(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }
    
    React.useEffect(() => {
        if(token != '')
        {
            fetchCouriers();
        }
    }, [token]);
    

    return (
        <>
              <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Manage Couriers</h1>
                    <div className="flex">
                        
                        {user?.permissions && (permission(user.permissions, 'couriers', 'create') || (user.user_type_id == 1)) ? (
                            <Link to='/admin/couriers/add' className="button button-outline-primary px-4">Add New Courier</Link>
                        ) : '' }
                    </div>
                </div>

                <div className="w-full">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">Courier List</h4>
                                </div>
                             
                            </div>
                        </div>
                        <div className="card-body overflow-x-auto">
                            <div className="w-full overflow-x-scroll">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th>Name</th>
                                            <th>Contact</th>
                                            <th>Charge</th>
                                            <th>Active</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {couriers?.map((courier, index) => (
                                            <tr key={index} className="h-12 border-b">
                                                
                                                <td><p className="">{courier.name}</p></td>
                                                <td><p className="">{courier.contact}</p></td>
                                                <td><p className="">Tk. {courier.charge}</p></td>
                                                <td>
                                                    {courier.active ? (
                                                        <span className="text-sm bg-green-300 px-1 rounded-full">Enabled</span>
                                                    ) : (
                                                        <span className="text-sm bg-red-300 px-1 rounded-full">Disabled</span>
                                                    )}
                                                </td>
                                                <td>
                                                {user?.permissions && (permission(user.permissions, 'couriers', 'update') || (user.user_type_id == 1)) ? (
                                                    <Link to={`/admin/couriers/${courier.id}/edit`} className="text-sm bg-green-600 text-white mx-2 px-2 py-1 rounded"><i className="fas fa-edit"></i></Link>
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
        </>
    )
}

export default Couriers
