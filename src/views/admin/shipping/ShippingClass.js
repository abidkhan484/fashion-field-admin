import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import Modal from 'react-responsive-modal'
import { Link, useHistory } from 'react-router-dom'
import { permission } from 'helper/permission';

export default function ShippingClass() {

    const { token, user } = useSelector(state => state.auth)

    const [modal, setModal] = React.useState(false);

    const [className, setClassName] = React.useState('');
    const [classDefault, setClassDefault] = React.useState(false);
    const [classCharge, setClassCharge] = React.useState('');
    const [classErrors, setClassErrors] = React.useState([]);

    const [classes, setClasses] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'shipping_management', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleAddShippingClass = () => {
        axios.post('/shipping-classes', {
            name: className,
            default: classDefault,
            charge: classCharge
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            // console.log(response);
            if(response.status == 200)
                setModal(false)

            fetchClasses();
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status == 422)
            {
                setClassErrors(errors.response.data.errors);
            }
        })
    }

    const fetchClasses = () => {
        axios.get('/shipping-classes', {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setClasses(response.data);
            console.log(response);
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchClasses();
        }
    }, [token]);

    const removeClass = (id) => {
        axios.post(`/shipping-classes/${id}`, {
            _method: 'DELETE'
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            fetchClasses()
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Shipping Class and Charges</h1>
                    <div className="flex">
                        
                    {user?.permissions && (permission(user.permissions, 'shipping_management', 'create') || (user.user_type_id == 1)) ? (
                        <button className="button button-outline-primary px-4" onClick={() => setModal(!modal)}>Add Shipping Class</button>
                    ) : '' }
                    </div>
                </div>
                <div className="w-full -mx-1 flex">
                    <div className="w-full mx-1">
                        <div className="card">
                            <div className="border-b">
                                <div className="card-header">
                                    <div>
                                        <h4 className="pageHeading">Shipping Classes</h4>
                                    </div>
                                    {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                                    {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="w-full">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b h-12">
                                                <th className="tableHeader">Name</th>
                                                <th className="tableHeader">Total Cities</th>
                                                <th className="tableHeader">Charge</th>
                                                <th className="tableHeader">Default</th>
                                                <th className="tableHeader">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {classes?.map((item, index) => (
                                                <tr key={index} className="border-b py-4 h-20">
                                                    <td className="tableData"><p>{item.name}</p></td>
                                                    <td className="tableData"><p>{item.cities.length}</p></td>
                                                    <td className="tableData"><p>{item.charge}</p></td>
                                                    <td className="tableData"><p>{item.default ? 'Default' : ''}</p></td>
                                                    <td className="tableData">
                                                        
                                                        {user?.permissions && (permission(user.permissions, 'shipping_management', 'update') || (user.user_type_id == 1)) ? (
                                                            <Link to={`/admin/shipping/class/${item.id}/edit`}><i class="fas fa-edit"></i></Link>
                                                        ) : '' }
                                                        
                                                        {user?.permissions && (permission(user.permissions, 'shipping_management', 'delete') || (user.user_type_id == 1)) ? (
                                                            <button className="ml-2 font-base" onClick={() => removeClass(item.id)}><i class="far fa-times-circle"></i></button>
                                                        ) : '' }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal open={modal} onClose={() => setModal(!modal)}>
                    <div style={{width: 500}}>
                        <div className="w-full border-b">
                            <h4>Add Shipping Class</h4>
                        </div>
                        <div className="p-4">
                            <div className="mb-2">
                                <label htmlFor="name" className="w-full">Class Name</label>
                                <input type="text" id="name" className="w-full" value={className} onChange={(e) => setClassName(e.target.value)} />
                                <p className="text-red-600">{classErrors.name}</p>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="charge" className="w-full">Charge</label>
                                <input type="text" pattern="[0-9]" id="charge" className="w-full" value={classCharge} onChange={(e) => setClassCharge(e.target.value)} />
                                <p className="text-red-600">{classErrors.charge}</p>
                            </div>
                            <div className="mb-1">
                                <label htmlFor="default" className="w-full"><input type="checkbox" id="default" value={classDefault} onChange={() => setClassDefault(!classDefault)} /> Default?</label>
                                <p className="text-red-600">{classErrors.default}</p>
                            </div>
                            <div className="w-full float-right">
                                <button onClick={() => handleAddShippingClass()} className="float-right bg-blue-400 rounded text-white px-4 py-2">Add</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}
