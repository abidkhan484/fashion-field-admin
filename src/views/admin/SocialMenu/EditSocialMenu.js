import React from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { permission } from 'helper/permission';

const EditSocialMenu = () => {
    const { token, user } = useSelector(state => state.auth)
    let { id } = useParams();

    const [loading, setLoading] = React.useState(false);
    const [key, setKey] = React.useState('');
    const [value, setValue] = React.useState('');
    const [errors,setErrors] = React.useState([]);
   
    let history = useHistory();

    const handleSocialSubmit = () => {
        axios.put(`/appearance/${id}`, {
           
            key: key,
            value: value,
         
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/socialmenu')
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status === 422)
            {
                setErrors(errors.response.data.errors);
            }
        })
    }
    const fetchAppearance = (id) => {
        axios.get(`/appearance/${id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            // console.log(response);
            setKey(response.data.key)
            setValue(response.data.value)
         
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchAppearance(id);
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Edit Social Link</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Edit Social Link</h4>
                        </div>
                       
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="w-full flex -mx-1">
                        <div className="w-1/3 mx-1">
                            <label htmlFor="name" className="createFromInputLabel">Key</label>
                            <input type="text" onChange={(e) => setKey(e.target.value)} value={key} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.key}</p>
                        </div>
                        <div className="w-1/3 mx-1">
                            <label htmlFor="contact" className="createFromInputLabel">Value</label>
                            <input type="text" onChange={(e) => setValue(e.target.value)} value={value} className="createFromInputField" />
                            <p className="text-red-600 text-sm">{errors.value}</p>
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
                        <button onClick={() => handleSocialSubmit()} className="button button-primary w-32">Update</button>
                    </>
                )}

            </div>
        </div>
    )
}

export default EditSocialMenu
