import React, { useEffect, useState } from 'react'
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Select from 'react-select'

const shippingOptions = [
    { value: "home", label: "Home" },
    { value: "office", label: "Office" },
    { value: "gift", label: "Gift" },
]

const UpdateShippingInfo = props => {
    const { updateShippingInfoModal, setUpdateShippingInfoModal, orderData } = props

    const [shippingType, setShippingType] = useState(null)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [selectedArea, setSelectedArea] = useState(null)
    const [address, setAddress] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [department, setDepartment] = useState("")
    const [designation, setDesignation] = useState("")
    const [senderName, setSenderName] = useState("")
    const [senderMobileNumber, setSenderMobileNumber] = useState("")

    const [districtOptionsAxios, setDistrictOptionsAxios] = useState([])
    const [districtOptionsCustom, setDistrictOptionsCustom] = useState([])

    const [citiesOptionsAxios, setCitiesOptionsAxios] = useState([])
    const [citiesOptionsCustom, setCitiesOptionsCustom] = useState([])

    const [areaOptionsAxios, setAreaOptionsAxios] = useState([])
    const [areaOptionCustom, setAreaOptionCustom] = useState([])

    const [loading, setLoading] = useState(false)
    const [errorStatus, setErrorStatus] = useState(null)

    const { token } = useSelector(state => state.auth);


    useEffect(() => {

        if (shippingType?.value == "home") {
            setCompanyName("")
            setDepartment("")
            setDesignation("")
            setSenderName("")
            setSenderMobileNumber("")
        }

        if (shippingType?.value == "gift") {
            setCompanyName("")
            setDepartment("")
            setDesignation("")
            setSenderName(orderData?.shipping?.sender_name == null ? "" : orderData?.shipping?.sender_name)
            setSenderMobileNumber(orderData?.shipping?.sender_number == null ? "" : orderData?.shipping?.sender_number)
        }

        if (shippingType?.value == "office") {
            setSenderName("")
            setSenderMobileNumber("")
            setCompanyName(orderData?.shipping?.company_name == null ? "" : orderData?.shipping?.company_name)
            setDepartment(orderData?.shipping?.department == null ? "" : orderData?.shipping?.department)
            setDesignation(orderData?.shipping?.designation == null ? "" : orderData?.shipping?.designation)
        }

    }, [shippingType])



    const handleUpdateInfo = () => {

        setLoading(true)

        const data = {
            type: shippingType?.value,
            name: name,
            phone: phone,
            email: email,
            region: selectedDistrict?.label == null ? "" : selectedDistrict?.label,
            city: selectedCity?.label == null ? "" : selectedCity?.label,
            area: selectedArea?.label == null ? "" : selectedArea?.label,
            address: address,
            company_name: companyName,
            department: department,
            designation: designation,
            sender_name: senderName,
            sender_number: senderMobileNumber
        }

        axios.post(`/manage-orders/${orderData?.id}/shipping-address`, data, {
            headers: {
                Authorization: token,
                Accept: 'application/json',
            }
        }).then(response => {
            console.log(response)
            setUpdateShippingInfoModal(false)
            setLoading(false)
        }).catch(errors => {
            console.log(errors.response)
            setErrorStatus(errors.response?.data?.errors)
            setLoading(false)
        })

    }

    useEffect(() => {
        setName(orderData?.shipping?.name)
        setPhone(orderData?.shipping?.phone)
        setEmail(orderData?.shipping?.email == null ? "" : orderData?.shipping?.email)
        setSelectedDistrict({ value: orderData?.shipping?.region, label: orderData?.shipping?.region })
        setSelectedCity({ value: orderData?.shipping?.city, label: orderData?.shipping?.city })
        setSelectedArea({ value: orderData?.shipping?.area, label: orderData?.shipping?.area })
        setShippingType({ value: orderData?.shipping_type, label: orderData?.shipping_type })
        setCompanyName(orderData?.shipping?.company_name == null ? "" : orderData?.shipping?.company_name)
        setDepartment(orderData?.shipping?.department == null ? "" : orderData?.shipping?.department)
        setDesignation(orderData?.shipping?.designation == null ? "" : orderData?.shipping?.designation)
        setSenderName(orderData?.shipping?.sender_name == null ? "" : orderData?.shipping?.sender_name)
        setSenderMobileNumber(orderData?.shipping?.sender_number == null ? "" : orderData?.shipping?.sender_number)
        setAddress(orderData?.shipping?.address)
        setErrorStatus(null)

    }, [orderData])

    // getting and making the options list for district
    useEffect(() => {
        if (token != "" && updateShippingInfoModal) {
            axios.get("/address/regions", {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response.data)
                setDistrictOptionsAxios(response.data)
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }, [token, updateShippingInfoModal])

    useEffect(() => {
        setDistrictOptionsCustom([])
        if (districtOptionsAxios.length > 0) {
            districtOptionsAxios.map((item, index) => {
                setDistrictOptionsCustom(prevState => [...prevState, { value: item.id, label: item.name }])
            })
        }

    }, [districtOptionsAxios])

    //getting and making the options list for cities
    useEffect(() => {
        if (token != "" && updateShippingInfoModal && selectedDistrict?.value) {
            axios.get(`/address/${selectedDistrict?.value}/cities`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response.data)
                setCitiesOptionsAxios(response.data)
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }, [selectedDistrict, token])

    useEffect(() => {
        setCitiesOptionsCustom([])
        if (citiesOptionsAxios.length > 0) {
            citiesOptionsAxios.map((item, index) => {
                setCitiesOptionsCustom(prevState => [...prevState, { value: item.id, label: item.name }])
            })
        }
    }, [citiesOptionsAxios])

    //getting and making options list for areas
    useEffect(() => {
        if (token != "" && updateShippingInfoModal && selectedCity?.value) {
            axios.get(`/address/${selectedCity?.value}/areas`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                console.log(response.data)
                setAreaOptionsAxios(response.data)
            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }, [selectedCity, token])

    useEffect(() => {

        setAreaOptionCustom([])

        if (areaOptionsAxios.length > 0) {
            areaOptionsAxios.map((item, index) => {
                setAreaOptionCustom(prevState => [...prevState, { value: item.id, label: item.name }])
            })
        }

    }, [areaOptionsAxios])

    const handleModalClose = () => {
        setUpdateShippingInfoModal(false)

    }



    return (
        <Modal open={updateShippingInfoModal} onClose={handleModalClose} center={true} blockScroll={false}>
            <div style={{ width: 600, padding: 20 }}>

                <div className='grid grid-cols-12 mb-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Shipping Type:</p>
                    </div>
                    <div className='col-span-9'>
                        <Select
                            value={shippingType}
                            onChange={option => { setShippingType(option) }}
                            options={shippingOptions}
                            className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                            placeholder="Select Shipping Type"
                            isClearable={true}
                            isSearchable={true}
                            id="shipping-type"
                            maxMenuHeight={155}
                        />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.type}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12'>
                    <div className='col-span-3 flex items-center'>
                        <p>Name:</p>
                    </div>
                    <div className='col-span-9'>
                        <input type="text" className="createFromInputField" value={name} onChange={e => setName(e.target.value)} />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.name}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Mobile:</p>
                    </div>
                    <div className='col-span-9'>
                        <input type="tel" className="createFromInputField" value={phone} onChange={e => setPhone(e.target.value)} />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.phone}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Email:</p>
                    </div>
                    <div className='col-span-9'>
                        <input type="email" className="createFromInputField" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Region:</p>
                    </div>
                    <div className='col-span-9'>
                        <Select
                            value={selectedDistrict}
                            onChange={option => { setSelectedDistrict(option); setSelectedCity(null); setSelectedArea(null) }}
                            options={districtOptionsCustom}
                            className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                            placeholder="Select Division"
                            isClearable={true}
                            isSearchable={true}
                            id="district"
                            maxMenuHeight={155}
                        />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.region}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>City:</p>
                    </div>
                    <div className='col-span-9'>
                        <Select
                            value={selectedCity}
                            onChange={option => { setSelectedCity(option); setSelectedArea(null) }}
                            options={citiesOptionsCustom}
                            className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                            placeholder="Select City"
                            isClearable={true}
                            isSearchable={true}
                            id="city"
                            maxMenuHeight={155}
                        />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.city}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Area:</p>
                    </div>
                    <div className='col-span-9'>
                        <Select
                            value={selectedArea}
                            onChange={option => { setSelectedArea(option) }}
                            options={areaOptionCustom}
                            className="w-full selectTag font-Poppins font-normal text-sm1 mt-2 mb-1"
                            placeholder="Select Area"
                            isClearable={true}
                            isSearchable={true}
                            id="area"
                            maxMenuHeight={155}
                        />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.area}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-12 mt-4'>
                    <div className='col-span-3 flex items-center'>
                        <p>Address:</p>
                    </div>
                    <div className='col-span-9'>
                        <input type="text" className="createFromInputField" value={address} onChange={e => setAddress(e.target.value)} />
                        {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.address}</p>}
                    </div>
                </div>

                {
                    shippingType?.value == "office" && <div>
                        <div className='grid grid-cols-12 mt-4'>
                            <div className='col-span-3 flex items-center'>
                                <p>Company Name:</p>
                            </div>
                            <div className='col-span-9'>
                                <input type="text" className="createFromInputField" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.company_name}</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-12 mt-4'>
                            <div className='col-span-3 flex items-center'>
                                <p>Department:</p>
                            </div>
                            <div className='col-span-9'>
                                <input type="text" className="createFromInputField" value={department} onChange={e => setDepartment(e.target.value)} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.department}</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-12 mt-4'>
                            <div className='col-span-3 flex items-center'>
                                <p>Designation:</p>
                            </div>
                            <div className='col-span-9'>
                                <input type="text" className="createFromInputField" value={designation} onChange={e => setDesignation(e.target.value)} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.designation}</p>}
                            </div>
                        </div>
                    </div>
                }

                {
                    shippingType?.value == "gift" && <div>
                        <div className='grid grid-cols-12 mt-4'>
                            <div className='col-span-3 flex items-center'>
                                <p>Sender Name:</p>
                            </div>
                            <div className='col-span-9'>
                                <input type="text" className="createFromInputField" value={senderName} onChange={e => setSenderName(e.target.value)} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.sender_name}</p>}
                            </div>
                        </div>

                        <div className='grid grid-cols-12 mt-4'>
                            <div className='col-span-3 flex items-center'>
                                <p>Sender Mobile Number:</p>
                            </div>
                            <div className='col-span-9'>
                                <input type="text" className="createFromInputField" value={senderMobileNumber} onChange={e => setSenderMobileNumber(e.target.value)} />
                                {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus?.sender_number}</p>}
                            </div>
                        </div>
                    </div>
                }

                <div className="mt-8 flex justify-end">
                    {(loading) ? (
                        <>
                            <button className="button button-primary w-32" disabled> <span className="fas fa-sync-alt animate-spin"></span></button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleUpdateInfo} className="button button-primary px-4">Update Shipping Info</button>
                        </>
                    )}

                </div>

            </div>
        </Modal>
    )
}

export default UpdateShippingInfo
