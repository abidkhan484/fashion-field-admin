import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { permission } from 'helper/permission'
import { toast } from 'react-toastify';

const EditingCupon = props => {

    const { token, user } = useSelector(state => state.auth);

    const { state } = useParams()

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'offers_coupon', 'update')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])


    const [cuponName, setCuponName] = useState("")
    const [cuponCode, setCuponCode] = useState("")
    const [cuponDescription, setCuponDescription] = useState("")
    const [cuponStartDate, setCuponStartDate] = useState("")
    const [cuponEndDate, setCuponEndDate] = useState("")
    const [maxUse, setMaxUse] = useState("")
    const [cuponValue, setCuponValue] = useState("")
    const [cuponType, setCuponType] = useState(null)
    const [cuponLimit, setCuponLimit] = useState(false)
    const [couponStatus, setCuponStatus] = useState(null)
    const [cuponMinCost, setCuponMinCost] = useState(false)
    const [loading, setLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState(null)

    const cuponTypeOptions = [
        {
            value: "fixed",
            label: "Fixed"
        },
        {
            value: "percentage",
            label: "Percentage"
        }
    ]

    const couponStatuses = [
        {
            value: "active",
            label: "Active"
        },
        {
            value: "inactive",
            label: "Inactive"
        }
    ]

    const submitCouponData = async (event) => {
        event.preventDefault();
          try {
                const data = 
                {
                    name: cuponName,
                    code: cuponCode,
                    description: cuponDescription,
                    start_date: cuponStartDate,
                    end_date: cuponEndDate,
                    type: cuponType?.value,
                    value: cuponValue,
                    is_limited: cuponLimit,
                    max_use: maxUse,
                    min_cost: cuponMinCost,
                    status: couponStatus?.value,
                }

                const response =  await axios.put(`/coupons/${state}`,data, { headers: {
                        Authorization: token,
                        Accept: 'application/json',
                    }
                });

                toast.success(response.data.message);
                setValidationErrors([])
                history.push('/admin/allCupons');

         }catch (error) {
             if(error.response.status === 422)
               setValidationErrors(error.response.data.errors)
         }

    }

    useEffect(() => {
        if (state != undefined && token) {
            axios.get(`/coupons/${state}`, {
                headers: {
                    Authorization: token,
                    Accept: 'application/json',
                }
            }).then(response => {
                setCuponName(response.data?.name)
                setCuponCode(response.data?.code)
                setCuponDescription(response.data?.description)
                setCuponStartDate(response.data?.start_date)
                setCuponEndDate(response.data?.end_date)
                setMaxUse(response.data?.max_use)
                setCuponValue(response.data?.value)
                setCuponType({ value: response.data?.type, label: response.data?.type.charAt(0).toUpperCase() + response.data?.type.slice(1) })
                setCuponStatus({ value: response.data?.status, label: response.data?.status.charAt(0).toUpperCase() + response.data?.status.slice(1) })
                setCuponMinCost(response.data?.min_cost)
                setCuponLimit(response.data?.is_limited)

            }).catch(errors => {
                console.log(errors.response)
            })
        }
    }, [state, token])



    return (
        <div className="px-8 mt-8 mb-8">

            <div className="w-full mb-6">
                <h1 className="pageHeading">Edit Cupon</h1>
            </div>

            <div className="card">

            <div className="w-2/3">

                <div className="grid grid-cols-12">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponName" className="createFromInputLabel">Cupon Name *</label>
                    </div>
                    <div className="col-span-8">
                        <input type="text" id="cuponName" className="createFromInputField" placeholder="Enter the name of the Cupon" value={cuponName} onChange={e => setCuponName(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`name`] ? validationErrors[`name`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponCode" className="createFromInputLabel">Cupon Code</label>
                    </div>
                    <div className="col-span-8">
                        <input type="text" id="cuponCode" className="createFromInputField" placeholder="Enter the code for the Cupon" value={cuponCode} onChange={e => setCuponCode(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`code`] ? validationErrors[`code`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponDescription" className="createFromInputLabel">Cupon Description</label>
                    </div>
                    <div className="col-span-8">
                        <textarea id="cuponDescription" className="createFromInputField" rows="3" placeholder="Enter the description for the Cupon" value={cuponDescription} onChange={e => setCuponDescription(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`description`] ? validationErrors[`description`][0] : null}
                        </p>                       
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="startDate" className="createFromInputLabel">Cupon Start Date</label>
                    </div>
                    <div className="col-span-8">
                        <input type="date" id="startDate" className="createFromInputField" placeholder="Select Start Date of the Cupon" value={cuponStartDate} onChange={e => setCuponStartDate(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`start_date`] ? validationErrors[`start_date`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="endDate" className="createFromInputLabel">Cupon End Date</label>
                    </div>
                    <div className="col-span-8">
                        <input type="date" id="endDate" className="createFromInputField" placeholder="Select End Date of the Cupon" value={cuponEndDate} onChange={e => setCuponEndDate(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`end_date`] ? validationErrors[`end_date`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponType" className="createFromInputLabel">Type of the Cupon: </label>
                    </div>
                    <div className="col-span-8">
                        <Select
                            value={cuponType}
                            onChange={option => { setCuponType(option) }}
                            options={cuponTypeOptions}
                            className="w-full createFromInputLabel selectTag"
                            placeholder="Select Cupon Type"
                            isClearable={true}
                            isSearchable={true}
                        />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`type`] ? validationErrors[`type`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponValue" className="createFromInputLabel">Value of the Cupon: </label>
                    </div>
                    <div className="col-span-8">
                        <input type="number" id="cuponValue" className="createFromInputField" placeholder="Enter value of the Cupon" value={cuponValue} onChange={e => setCuponValue(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`value`] ? validationErrors[`value`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label htmlFor="cuponValue" className="createFromInputLabel">Cupon Min Cost: </label>
                    </div>
                    <div className="col-span-8">
                        <input type="number" className="createFromInputField" placeholder="Enter Cupon Cost" value={cuponMinCost} onChange={e => setCuponMinCost(e.target.value)} />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`min_cost`] ? validationErrors[`min_cost`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-12 mt-4">
                    <div className="col-span-4 flex items-center">
                        <label className="createFromInputLabel">Coupon Status: </label>
                    </div>
                    <div className="col-span-8">
                        <Select
                            value={couponStatus}
                            onChange={option => { setCuponStatus(option) }}
                            options={couponStatuses}
                            className="w-full createFromInputLabel selectTag"
                            placeholder="Select Cupon Type"
                            isClearable={true}
                            isSearchable={true}
                        />
                        <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`status`] ? validationErrors[`status`][0] : null}
                        </p>
                    </div>
                </div>

                <div className="flex items-center mt-4">
                    <input type="checkbox" id="limitedOption" checked={cuponLimit} onChange={() => setCuponLimit(prevState => !prevState)} />
                    <label className="font-DMSans text-sm1 ml-2" htmlFor="limitedOption">IS THIS CUPON LIMITED?</label>
                </div>

                {
                    cuponLimit && <div className="grid grid-cols-12 mt-4">
                        <div className="col-span-4 flex items-center">
                            <label htmlFor="maxUse" className="createFromInputLabel">Number of Maximum use for the Cupon: </label>
                        </div>
                        <div className="col-span-8">
                            <input type="number" id="maxUse" className="createFromInputField" placeholder="Enter Maximum use for the Cupon" value={maxUse} onChange={e => setMaxUse(e.target.value)} />
                            <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`max_use`] ? validationErrors[`max_use`][0] : null}
                        </p>
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
                            <button onClick={submitCouponData} className="button button-primary w-32">Update Cupon</button>
                        </>
                    )}

                </div>

                </div>

            </div>
        </div>
    )
}

export default EditingCupon

