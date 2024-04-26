import React,{useState,useEffect} from 'react'
import ReactQuill from 'react-quill'
import axios from "axios"
import {useHistory,useParams} from "react-router-dom"
import { useSelector } from 'react-redux'
import { permission } from 'helper/permission'

const editorModules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'video'],
    ],
 
}

const editorFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]


const EditPage = () => {
    const [name,setName] = useState("");
    const [ description,setDescription] = useState("");
    const [status,setStatus]=useState("")
    const [errorStatus, setErrorStatus] = useState(null)
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = React.useState(false);

    const { token, user } = useSelector(state => state.auth);
    let { id } = useParams();

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'pages', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchPage = (id) => {
        axios.get(`/pages/${id}`, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setName(response.data.name)
            setDescription(response.data.description)
           
        }).catch(errors => {
            console.log(errors.response);
        })
    }

    
    const handleUpdatePageSubmit = () => {
        axios.post(`/pages/${id}`, {
           
            name: name,
            description: description,
            status:status
            
        }, {
            headers: {
                Authorization: token,
                Accept: 'application/json'
            }
        }).then(response => {
            history.push('/admin/page')
        }).catch(errors => {
            console.log(errors.response);
            if(errors.response.status === 422)
            {
                setErrors(errors.response.data.errors);
            }
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchPage(id);
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
        <div className="page-heading">
            <h1 className="pageHeading">Edit New Page</h1>
            <div className="flex">
                
            </div>
        </div>
        <div className="card">
            <div className="border-b">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Edit Page</h4>
                    </div>
                   
                </div>
            </div>
            <div className="card-body overflow-x-auto">
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 flex items-center">
                                <label htmlFor="name" className="createFromInputLabel">Name</label>
                            </div>
                            <div className="col-span-8">
                                <input type="text" id="name" className="createFromInputField" placeholder="Name" name="name" onChange={(e) => setName(e.target.value)} value={name} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-4 flex items-center">
                                <label htmlFor="description" className="createFromInputLabel">Description</label>
                            </div>
                            <div className="col-span-8">
                               
                                <ReactQuill
                                    theme="snow"
                                    onChange={value => setDescription(value)}
                                    modules={editorModules}
                                    formats={editorFormats}
                                    placeholder="Description"
                                    value={description}
                                />
                               
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.description}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-12 mt-4">
                            <div className="col-span-4 flex items-center">
                                <label htmlFor="description" className="createFromInputLabel">Status</label>
                            </div>
                            <div className="col-span-8">
                               
                            <select className="createFromInputField" onChange={(e) => setStatus(e.target.value)} value={status} >
                                <option value="">Select One</option>
                                <option value="publish">Publish</option>
                                <option value="draft">Darft</option>
                            </select>
                               
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.description}</p>}
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
                    <button onClick={() => handleUpdatePageSubmit()} className="button button-primary w-32">Update</button>
                </>
            )}

        </div>
    </div>
    )
}

export default EditPage
