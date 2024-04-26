import axios from "axios";
import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { permission } from "helper/permission";
import { ImSpinner9 } from "react-icons/im"

const LogisticRequisitionReport = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [startDate, setStatDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [storeFromAxios, setStoreFromAxios] = useState(null);
    const [storeOptionCustom, setStoreOptionCustom] = useState([]);
    const [store, setStore] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);

    const [logisticReportPreview, setLogisticReportPreview] = useState([]);

    const [loading, setLoading] = useState(false)

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "reports_logistic_requisition_report",
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
                .get("/stores", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setStoreFromAxios(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    }, [token]);

    useEffect(() => {
        if (storeFromAxios != null) {
            setStoreOptionCustom([]);
            setStoreOptionCustom([{ value: "", label: "All" }]);
            storeFromAxios.map((value) => {
                setStoreOptionCustom((prevState) => [
                    ...prevState,
                    { value: value?.id, label: value?.name },
                ]);
            });
        }
    }, [storeFromAxios]);
    useEffect(() => {
        console.log(storeOptionCustom);
    }, [storeOptionCustom]);

    const handleLogisticReport = () => {
        setLoading(true)
        axios
            .post(
                "/response/order/requision-orders",
                {
                    start_date: startDate,
                    end_date: endDate,
                    store_id: store?.value,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                setLogisticReportPreview(response.data);
                setErrorStatus(null);
                setLoading(false)
            })
            .catch((errors) => {
                console.log(errors.response);
                setErrorStatus(errors.response.data.errors);
                setLoading(false)
            });
    };

    const handleLogisticDownloadReport = () => {
        setLoading(true)
        axios
            .post(
                "/reports/order/requision-orders",
                {
                    start_date: startDate,
                    end_date: endDate,
                    store_id: store?.value,
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
                setStatDate("");
                setEndDate("");
                setStore(null);
                setLoading(false)
                window.location.replace(response?.data?.url);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false)
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Logistic Requisition Report</h1>
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
                                    <label>Select Shop</label>
                                    {storeOptionCustom.length > 0 && (
                                        <Select
                                            options={storeOptionCustom}
                                            onChange={(option) =>
                                                setStore(option)
                                            }
                                            value={store}
                                        />
                                    )}
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.store_id}
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
                                                onClick={handleLogisticReport}
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
                                                Image
                                            </th>
                                            <th className="tableHeader text-center">
                                                Name
                                            </th>
                                            <th className="tableHeader text-center">
                                                SKU
                                            </th>
                                            <th className="tableHeader text-center">
                                                Style Number
                                            </th>
                                            <th className="tableHeader text-center">
                                                Quantity
                                            </th>
                                            <th className="tableHeader text-center">
                                                Cost
                                            </th>
                                            {/* <th className="tableHeader text-center">Unit Selling Price</th> */}
                                            <th className="tableHeader text-center">
                                                Total Cost
                                            </th>
                                            <th className="tableHeader text-center">
                                                Last Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {logisticReportPreview.map(
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
                                                            {item.order_number}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <img
                                                            src={item.thumbnail}
                                                        />
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item.name} -
                                                            {item.attributes.join(
                                                                ", "
                                                            )}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item.SKU}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item.style_no}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item.quantity}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="text-center">
                                                            {item.cost_price}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center">
                                                            {item.total_cost}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="text-center">
                                                            {item.status}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {logisticReportPreview.length > 0 && (
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
                                                        handleLogisticDownloadReport
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

export default LogisticRequisitionReport;
