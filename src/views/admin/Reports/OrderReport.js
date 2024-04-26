import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { permission } from "helper/permission";
import { ImSpinner9 } from "react-icons/im"

// import { minHeight } from 'tailwindcss/defaultTheme';

export default function OrderReport() {
    const { token, user } = useSelector((state) => state.auth);
    const [columns, setColumns] = React.useState([
        { label: "SL", value: "SL" },
        { label: "Order Number", value: "Order Number" },
        { label: "Order Date", value: "Order Date" },
        { label: "Order Status", value: "Order Status" },
        { label: "Payment Status", value: "Payment Status" },
        { label: "Payment Method", value: "Payment Method" },
        { label: "Customer Name", value: "Customer Name" },
        { label: "Phone Number", value: "Phone Number" },
        { label: "Customer Address", value: "Customer Address" },
        { label: "Image", value: "Image" },
        { label: "Product Name", value: "Product Name" },
        { label: "Variant", value: "Variant" },
        { label: "SKU No", value: "SKU No" },
        { label: "Style No", value: "Style No" },
        { label: "Qty", value: "Qty" },
        { label: "Seller/Supplier", value: "Seller/Supplier" },
        { label: "Unit Cost", value: "Unit Cost" },
        { label: "Unit Selling Price", value: "Unit Selling Price" },
        { label: "Total Price", value: "Total Price" },
    ]);

    const [selectedColumns, setSelectedColumns] = React.useState([]);
    const [startDate, setStatDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    const [couriers, setCourers] = React.useState([]);
    const [selectedCourier, setSelectedCourier] = React.useState(null);

    const [statuses, setStatuses] = React.useState([]);
    const [selectedStatus, setSelectedStatus] = React.useState(null);

    const [orderReportPreview, setOrderReportPreview] = useState([]);
    const [loading, setLoading] = useState(false)

    const [errorStatus, setErrorStatus] = useState(null);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "reports_shipment_report",
                    "read"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    React.useEffect(() => {
        if (token != "") {
            axios
                .get("/couriers", {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setCourers([]);
                    setCourers([{ label: "All", value: "" }]);
                    response.data.map((item) => {
                        setCourers((prevState) => [
                            ...prevState,
                            { label: item.name, value: item.id },
                        ]);
                    });
                });

            axios
                .get("/statuses", {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    setStatuses([]);
                    setStatuses([{ label: "All", value: "" }]);
                    const temp = response.data.filter(
                        (item) => item.name != "Cancelled"
                    );
                    temp.map((item) => {
                        setStatuses((prevState) => [
                            ...prevState,
                            { label: item.name, value: item.name },
                        ]);
                    });
                });
        }
    }, [token]);

    const exportSubmitHandler = () => {
        setLoading(true)
        let formData = new FormData();

        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
        formData.append(
            "courier_id",
            selectedCourier?.value ? selectedCourier.value : ""
        );
        formData.append(
            "status",
            selectedStatus?.value ? selectedStatus.value : ""
        );

        axios
            .post("/response/order/status-report", formData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setOrderReportPreview(response.data);
                setErrorStatus(null);
                setLoading(false)
            })
            .catch((errors) => {
                console.log(errors.response);
                setErrorStatus(errors.response?.data?.errors);
                setLoading(false)
            });
    };

    const handleOrderReport = () => {
        setLoading(true)
        let formData = new FormData();

        formData.append("start_date", startDate);
        formData.append("end_date", endDate);
        formData.append(
            "courier_id",
            selectedCourier?.value ? selectedCourier.value : ""
        );
        formData.append(
            "status",
            selectedStatus?.value ? selectedStatus.value : ""
        );

        axios
            .post("/reports/order/status-report", formData, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                window.location.replace(response.data.url);
                setStatDate("");
                setEndDate("");
                setSelectedStatus(null);
                setSelectedCourier(null);
                setLoading(false)
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false)
            });
    };

    useEffect(() => {
        console.log(orderReportPreview);
    }, [orderReportPreview]);

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Order Reports</h1>
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
                                        Export Orders Report
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div
                            className="card-body"
                            style={{ minHeight: "600px" }}
                        >
                            <div className="flex flex-wrap">
                                <div className="w-1/4 mx-1">
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
                                <div className="w-1/4 mx-1">
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
                                <div className="w-1/4 mx-1">
                                    <label>Select Courier</label>
                                    <Select
                                        options={couriers}
                                        onChange={(option) =>
                                            setSelectedCourier(option)
                                        }
                                        value={selectedCourier}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.courier_id}
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
                                                onClick={exportSubmitHandler}
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white mr-2"
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
                                                Order Number
                                            </th>
                                            <th className="tableHeader text-center">
                                                Customer Details
                                            </th>
                                            <th className="tableHeader text-center">
                                                Quantity
                                            </th>
                                            <th className="tableHeader text-center">
                                                Product Value (Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Shipping Charge (Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Order Total (Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Discount (Tk.)
                                            </th>
                                            {/* <th className="tableHeader text-center">
                                                Actual Sales (Tk.)
                                            </th> */}
                                            <th className="tableHeader text-center">
                                                Advance (Tk.)
                                            </th>
                                            <th className="tableHeader text-center">
                                                Advance Payment Method
                                            </th>
                                            <th className="tableHeader text-center">
                                                Receivable Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {orderReportPreview.map(
                                            (item, index) => (
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
                                                            {
                                                                item[
                                                                "Order_Number"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center">
                                                            Name:{" "}
                                                            {
                                                                item[
                                                                "Customer_Name"
                                                                ]
                                                            }
                                                        </p>
                                                        <p className="text-center">
                                                            Phone:{" "}
                                                            {
                                                                item[
                                                                "Customer_Phone"
                                                                ]
                                                            }
                                                        </p>
                                                        <p className="text-center">
                                                            Region:{" "}
                                                            {item["Region"]}
                                                        </p>
                                                        <p className="text-center">
                                                            City: {item["City"]}
                                                        </p>
                                                        <p className="text-center">
                                                            Area: {item["Area"]}
                                                        </p>
                                                        <p className="text-center">
                                                            Address:{" "}
                                                            {
                                                                item[
                                                                "Customer_Address"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item?.Qty}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item["Sales"]}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {
                                                                item[
                                                                "Shipping_Charge"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item["Total"]}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item["Discount"]}
                                                        </p>
                                                    </td>

                                                    {/* <td>
                                                        <p className="text-center">
                                                            {
                                                                item[
                                                                    "Actual_Sales"
                                                                ]
                                                            }
                                                        </p>
                                                    </td> */}

                                                    <td>
                                                        <p className="text-center">
                                                            {
                                                                item[
                                                                "Partial_Paid"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {
                                                                item[
                                                                "Partial_Paid_Payment_Method"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {
                                                                item[
                                                                "Receivable_Amount"
                                                                ]
                                                            }
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {orderReportPreview.length > 0 && (
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
                                                    onClick={handleOrderReport}
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
}
