import React from 'react'
import { useState} from 'react'
import { Modal } from 'react-responsive-modal';
import Select from "react-select";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const CustomerComponent = props => {
    const { customer, axios, token, paymentOptions, updateCustomerInfo } = props
    const initialData = {
        payment_method: '',
        transaction_number: '',
        amount: '',
    }
    const [transactionData, setTransactionData] = useState(initialData);

    const [selectedPaymentOption, setSelectedPaymentOption] = useState(null)
    const [modalState, setModalState] = useState(false);
    const [validationErrors, setValidationErrors] = useState(null)

    const handleInputChange = (name,value) => {
        const temp = {...transactionData}
        const tempObject = {[name]: value}
        Object.assign(temp, tempObject)
        setTransactionData(temp);
    }

    const changeModalState = () => {
        setTransactionData(initialData)
        setSelectedPaymentOption(null)
        setValidationErrors([])
        setModalState(!modalState)
    }

    const submitTransactionData = async (event) => {
        event.preventDefault();
        if(selectedPaymentOption)
          transactionData.payment_method = selectedPaymentOption.value

          try {
             const response =  await axios.post(`customers/${customer['id']}/refund-transactions`,transactionData,  {headers: {
                Authorization: token,
              },
            });

            setModalState(!modalState)
            updateCustomerInfo(response.data)
             
         }catch (error) {
             if(error.response.status === 422)
               setValidationErrors(error.response.data.errors)
            
             if(error.response.status === 404 || error.response.status === 406)
                 toast.error(error.response.data.message);
         }

    }

    return (
        <>
         <Modal open={modalState} onClose={() => !setModalState(!modalState)} center={true} blockScroll={false}>

         <form onSubmit={submitTransactionData}>
          <div className="px-4" style={{ width: 500, minHeight: 250 }}>
          <div className="mt-4">
            <p className="font-bold mb-4">Select payment Method</p>
            <Select
                isClearable={true}
                options={paymentOptions}
                value={selectedPaymentOption} 
                onChange={option => {setSelectedPaymentOption(option)}}
            />

            <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`payment_method`] ? validationErrors[`payment_method`][0] : null}
            </p>
            </div>

            {
            selectedPaymentOption &&  selectedPaymentOption.value !== 'cash' ? (
                <div className="mt-4">
                    {
                      selectedPaymentOption?.value === 'bank' ? ( <label className="font-bold">Bank Account Number</label> ) : <label className="font-bold">Transaction Number</label>
                    }
                  <input
                    type="text"
                    className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                    value={transactionData.transaction_number}
                    onChange={(e) => handleInputChange('transaction_number',e.target.value)}
                    /> 
                    <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`transaction_number`] ? validationErrors[`transaction_number`][0] : null}
                     </p>
                </div>

                ) : ""
            }

            {
                selectedPaymentOption ? 
                <div className="mt-4">
                    <label className="font-bold" htmlFor="transaction_id">Amount</label>
                    <input
                        type="number"
                        min={0}
                        className="border-1 block w-80 h-9 focus:outline-none px-4 mt-2 rounded font-DMSans text-sm1 mb-1"
                        value={transactionData.amount}
                        onChange={(e) => handleInputChange('amount',e.target.value)}
                    />
                    <p className="text-red-500 font-Poppins font-medium text-xs mt-2">{validationErrors && validationErrors[`amount`] ? validationErrors[`amount`][0] : null}
                    </p>
                </div>
                : ''
            }

           
             <div className="mt-4">
                <div className="flex justify-end mt-8">
                    <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-400 font-semibold text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
                    >
                    Update
                    </button>
                </div>

            </div>
            </div>
        </form>

      
        </Modal>

         <tr className="border-b py-4 h-20">
            <td className="tableData"><p>{customer.name}</p></td>
            <td className="tableData"><p>{customer.phone}</p></td>
            <td className="tableData"><p>{customer.email}</p></td>
            <td className="tableData"><p>{(customer.status) ? 'Active' : 'Disabled'}</p></td>
            <td className="tableData"><p>{customer.orders_count}</p></td>
            <td className="tableData"><p>{customer.wallet ? customer.wallet.amount : 0} Tk</p></td>
            <td>
            {
            (customer.wallet && customer.wallet['amount'] > 0) ? (
                        <>
                        <button onClick = {()=>changeModalState()} class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                            Refund
                        </button>
                        </>
                    ) : ''
                }
            </td>
            <td>
                <Link to={`/admin/customers/${customer.id}/refund-transactions`} class="bg-transparent bg-orange-700 font-semibold py-2 px-4 border rounded">
                  Details                     
               </Link>
            </td>
            <td>
                <Link to={`/admin/customers/${customer.id}/wallet-transactions`} class="bg-transparent bg-orange-700 font-semibold py-2 px-4 border rounded">
                  Details                            
               </Link>
            </td>
            <td>
                <Link to={`/admin/customers/${customer.id}/order-transactions`} class="bg-transparent bg-orange-700 font-semibold py-2 px-4 border rounded">
                  Details                            
               </Link>
            </td>
       </tr>
        </>
    )
}

export default CustomerComponent