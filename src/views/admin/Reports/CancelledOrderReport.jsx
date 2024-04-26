import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";
import { ImSpinner9 } from "react-icons/im"

const CancelledOrderReport = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [selectedCourier, setSelectedCourier] = useState(null);

    const [couriers, setCouriers] = React.useState([]);

    const [reportPreview, setReportPreview] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingD, setLoadingD] = useState(false);

    // const couriers = [
    //     { value: "FF EXPRESS", label: "FF EXPRESS" },
    //     { value: "Elham International", label: "Elham International" },
    // ];

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "reports_cancel_report",
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
                .get("/couriers", {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setCouriers([]);
                    setCouriers([{ label: "All", value: "" }]);
                    response.data.map((item) => {
                        setCouriers((prevState) => [
                            ...prevState,
                            { label: item.name, value: item.id },
                        ]);
                    });
                });
        }
    }, [token]);

    const handleCancelledOrderReportPreview = () => {
        setLoading(true)
        axios
            .post(
                "/reports/cancelled-orders/response",
                {
                    start_date: startDate,
                    end_date: endDate,
                    courier_id: selectedCourier?.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                setReportPreview(response.data);
                setLoading(false)
            })
            .catch((errros) => {
                // console.log(errros.response);
                setLoading(false)
            });
    };

    const handleCancelledOrderReportDownload = () => {
        setLoadingD(true)
        axios
            .post(
                "/reports/cancelled-orders/report",
                {
                    start_date: startDate,
                    end_date: endDate,
                    courier_id: selectedCourier?.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                window.location.replace(response?.data?.url);
                setLoadingD(false)
            })
            .catch((errors) => {
                // console.log(errros.response);
                setLoadingD(false)
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Cancelled Order Report</h1>
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
                                        Cancelled Order Report
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-body" style={{ minHeight: "600px" }}>
                        <div className="flex flex-wrap">
                            <div className="w-1/5 mx-1">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    className="createFromInputField"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                />
                            </div>

                            <div className="w-1/5 mx-1">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    className="createFromInputField"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                            <div className="w-1/5 mx-1">
                                <label>Select Courier</label>
                                <Select
                                    options={couriers}
                                    onChange={(option) =>
                                        setSelectedCourier(option)
                                    }
                                // value={selectedCourier}
                                />
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
                                            onClick={handleCancelledOrderReportPreview}
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
                                            Image
                                        </th>
                                        <th className="tableHeader text-center">
                                            Product Info
                                        </th>
                                        <th className="tableHeader text-center">
                                            Order Info
                                        </th>
                                        <th className="tableHeader text-center">
                                            Customer Info
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {reportPreview?.map((item, index) => (
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
                                                <img src={item?.Image} />
                                            </td>

                                            <td>
                                                <p className="">
                                                    Name: {item?.Product_Name}
                                                </p>
                                                {item?.Variable?.map(
                                                    (item, index) => (
                                                        <span
                                                            className="bg-gray-100 px-2 rounded-full text-sm mr-1"
                                                            key={index}
                                                        >
                                                            {item}
                                                        </span>
                                                    )
                                                )}
                                                <p className="">
                                                    Quantity: {item?.Quantity}
                                                </p>
                                                <p className="">
                                                    SKU: {item?.SKU}
                                                </p>
                                                <p className="">
                                                    Style No: {item?.Style_No}
                                                </p>
                                                <p className="">
                                                    Unit Price:{" "}
                                                    {item?.Unit_Price}
                                                </p>
                                                <p className="">
                                                    Total Price:{" "}
                                                    {item?.Total_Price}
                                                </p>

                                                <p className="">
                                                    Seller-Supplier:{" "}
                                                    {item?.SellerSupplier}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="">
                                                    Order Date:{" "}
                                                    {item?.Order_Date}
                                                </p>
                                                <p className="">
                                                    Return Date:{" "}
                                                    {item?.Return_Date}
                                                </p>
                                                <p className="">
                                                    Order Number:{" "}
                                                    {item?.Order_Number}
                                                </p>
                                                <p className="">
                                                    Order Status:{" "}
                                                    {item?.Order_Status}
                                                </p>

                                                <p className="">
                                                    Shipping Charge:{" "}
                                                    {item?.Shipping_Charge}
                                                </p>
                                                <p className="">
                                                    Payable Price:{" "}
                                                    {item?.Payable_Amount}
                                                </p>

                                                <p className="">
                                                    Payment Status:{" "}
                                                    {item?.Payment_Status}
                                                </p>
                                                <p className="">
                                                    Courier: {item?.Courier}
                                                </p>
                                            </td>

                                            <td>
                                                <p className="">
                                                    Customer Name:{" "}
                                                    {item?.Customer_Name}
                                                </p>
                                                <p className="">
                                                    Customer Phone:{" "}
                                                    {item?.Customer_Phone}
                                                </p>
                                                <p className="">
                                                    Customer Address:{" "}
                                                    {item?.Customer_Address}
                                                </p>
                                                <p className="">
                                                    Area: {item?.Area}
                                                </p>
                                                <p className="">
                                                    City: {item?.City}
                                                </p>
                                                <p className="">
                                                    Region: {item?.Region}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {reportPreview.length > 0 && (
                                <div className="w-full mx-1 pt-2 float-right mt-10">
                                    {
                                        loadingD ? (
                                            <button
                                                // onClick={exportSubmitHandler}
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white mr-2"
                                            >
                                                <ImSpinner9 className="animate-spin" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={
                                                    handleCancelledOrderReportDownload
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
    );
};

export default CancelledOrderReport;

//argha shipan sarker
