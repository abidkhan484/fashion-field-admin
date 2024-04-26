import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { permission } from 'helper/permission';

export default function AddUser() {
    const { token, user } = useSelector(state => state.auth)

    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errors, setErrors] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'system_user', 'create')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const handleUserSubmit = () => {
        axios.post('/users', {
            name: name,
            email: email,
            password: password
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/users')
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status == 422)
            {
                setErrors(errors.response.data.errors);
            }
        })
    }

    // React.useEffect(() => {
    //     if(token != '')
    //     {
    //         fetchUsers();
    //     }
    // }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Add New System User</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Add User</h4>
                        </div>
                        {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                        {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full flex -mx-1">
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.name}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Email</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.email}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Password</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.password}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-8 mt-8 flex justify-end">
                {(loading) ? (
                    <>
                        <button className="button button-primary w-32" disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleUserSubmit()} className="button button-primary w-32">Create User</button>
                    </>
                )}

            </div>
        </div>
    )
}
