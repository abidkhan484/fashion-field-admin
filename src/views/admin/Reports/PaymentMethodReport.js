import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { ImSpinner9 } from "react-icons/im"

const PaymentMethodReport = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [startDate, setStatDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [statuses, setStatuses] = React.useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);

    const [reportPreview, setReportPreview] = useState([]);

    const [loading, setLoading] = useState(false)

    const paymentOptions = [
        { value: "", label: "All" },
        { value: "cod", label: "Cash On Delivery" },
        { value: "sslcommerz", label: "SSL Commerz" },
        { value: "bkash", label: "BKash" },
        { value: "nagad", label: "Nagad" },
        { value: "wallet", label: "Wallet" },
    ];

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "reports_payment_method_report",
                    "read"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (token != "") {
            axios
                .get("/statuses", { headers: { Authorization: token } })
                .then((response) => {
                    console.log(response.data);
                    setStatuses([]);
                    setStatuses([{ value: "", label: "All" }]);
                    response.data.map((item) => {
                        setStatuses((prevState) => [
                            ...prevState,
                            { value: item.name, label: item.name },
                        ]);
                    });
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [token]);

    const handlePaymentMethodReportPreview = () => {
        setLoading(true)
        axios
            .post(
                "/response/payment",
                {
                    start_date: startDate,
                    end_date: endDate,
                    payment_method: paymentMethod?.value,
                    status: selectedStatus?.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setLoading(false)
                setErrorStatus(null);
                setReportPreview(response.data);
            })
            .catch((errros) => {
                console.log(errros.response);
                setLoading(false)
                setErrorStatus(errros.response?.data?.errors);
            });
    };

    const handlePaymentMethodReportReport = () => {
        setLoading(true)
        axios
            .post(
                "/reports/payment",
                {
                    start_date: startDate,
                    end_date: endDate,
                    payment_method: paymentMethod?.value,
                    status: selectedStatus?.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setLoading(false)
                setStatDate("");
                setEndDate("");
                setPaymentMethod(null);
                setSelectedStatus(null);
                window.location.replace(response?.data?.url);
                setErrorStatus(null);
            })
            .catch((errros) => {
                console.log(errros.response);
                setErrorStatus(errros.response?.data?.errors);
                setLoading(false)
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Payment Method Report</h1>
                    <div className="flex"></div>
                </div>
            </div>

            <div className="flex -m-1">
                <div className="w-full mx-4">
                    <div className="card">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">
                                        Payment Method Report
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div
                            className="card-body"
                            style={{ minHeight: "600px" }}
                        >
                            <div className="flex flex-wrap">
                                <div className="w-1/5 mx-1">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        className="createFromInputField"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStatDate(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.start_date}
                                        </p>
                                    )}
                                </div>
                                <div className="w-1/5 mx-1">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        className="createFromInputField"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.end_date}
                                        </p>
                                    )}
                                </div>

                                <div className="w-1/5 mx-1">
                                    <label>Select Payment Method</label>
                                    <Select
                                        options={paymentOptions}
                                        onChange={(option) =>
                                            setPaymentMethod(option)
                                        }
                                        value={paymentMethod}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.payment_method}
                                        </p>
                                    )}
                                </div>

                                <div className="w-1/5 mx-1">
                                    <label>Select Status</label>
                                    <Select
                                        options={statuses}
                                        onChange={(option) =>
                                            setSelectedStatus(option)
                                        }
                                        value={selectedStatus}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.status}
                                        </p>
                                    )}
                                </div>

                                <div className="w-full mx-1 pt-2 float-right">
                                    {
                                        loading ? (
                                            <button
                                                // onClick={exportSubmitHandler}
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white mr-2"
                                            >
                                                <ImSpinner9 className="animate-spin" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={
                                                    handlePaymentMethodReportPreview
                                                }
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                            >
                                                Submit
                                            </button>
                                        )
                                    }
                                </div>

                                <table className="w-full table-fixed mt-10">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader text-center">
                                                SL. No.
                                            </th>
                                            <th className="tableHeader text-center">
                                                Order ID
                                            </th>
                                            <th className="tableHeader text-center">
                                                Quantity
                                            </th>
                                            <th className="tableHeader text-center">
                                                Payment Method
                                            </th>
                                            <th className="tableHeader text-center">
                                                Transaction Id
                                            </th>
                                            <th className="tableHeader text-center">
                                                Sales(Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Shipping Charge(Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Paid(Tk.)
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {reportPreview.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b py-4 h-20"
                                            >
                                                <td>
                                                    <p className="text-center">
                                                        {index + 1}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.ORDER_NUMBER}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.QUANTITY}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.PAYMENT_METHOD}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.TRANSACTION_ID}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.SALES}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.SHIPPING_CHARGE}
                                                    </p>
                                                </td>

                                                <td>
                                                    <p className="text-center">
                                                        {item.PAID}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {reportPreview.length > 0 && (
                                    <div className="w-full mx-1 pt-2 float-right mt-10">
                                        {
                                            loading ? (
                                                <button
                                                    // onClick={exportSubmitHandler}
                                                    className="float-right bg-blue-600 px-4 py-2 rounded text-white mr-2"
                                                >
                                                    <ImSpinner9 className="animate-spin" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={
                                                        handlePaymentMethodReportReport
                                                    }
                                                    className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                                >
                                                    Download
                                                </button>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodReport;
