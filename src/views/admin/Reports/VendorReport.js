import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const VendorReport = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [errorStatus, setErrorStatus] = useState(null);

    const [storeFromAxios, setStoreFromAxios] = useState(null);
    const [storeOptionCustom, setStoreOptionCustom] = useState([]);
    const [store, setStore] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [vendorReportPreview, setVendorReportPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingD, setLoadingD] = useState(false);

    const vendorStatusOptions = [
        { value: "", label: "All" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "InActive" },
    ];

    const paymentMethodOptions = [
        { value: "", label: "All" },
        { value: "cash", label: "Cash" },
        { value: "credit", label: "Credit" },
    ];

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "reports_vendor_report",
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

    const handleVendorPreviewReport = () => {
        setLoading(true);
        axios
            .post(
                "/response/vendor",
                {
                    store_id: store?.value,
                    status: selectedStatus?.value,
                    purchase_method: selectedPaymentMethod?.value,
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
                setVendorReportPreview(response.data);
                // window.location.replace(response?.data)
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    const handleVendorDownloadReport = () => {
        setLoadingD(true);
        axios
            .post(
                "/report/vendor",
                {
                    store_id: store?.value,
                    status: selectedStatus?.value,
                    purchase_method: selectedPaymentMethod?.value,
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
                window.location.replace(response?.data);
                setLoadingD(false);
                setStore(null);
                setSelectedStatus(null);
                setSelectedPaymentMethod(null);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoadingD(false);
            });
    };

    return (
        <div>
            <div className="px-8 mt-8 mb-8 overflow-y-auto">
                <div className="page-heading">
                    <h1 className="pageHeading">Vendor Report</h1>
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
                                    <label>Select Shop</label>
                                    <Select
                                        options={storeOptionCustom}
                                        onChange={(option) => setStore(option)}
                                        value={store}
                                        isClearable={true}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.store_id}
                                        </p>
                                    )}
                                </div>

                                <div className="w-1/4 mx-1">
                                    <label>Select Status</label>
                                    <Select
                                        options={vendorStatusOptions}
                                        onChange={(option) =>
                                            setSelectedStatus(option)
                                        }
                                        value={selectedStatus}
                                        isClearable={true}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.store_id}
                                        </p>
                                    )}
                                </div>

                                <div className="w-1/4 mx-1">
                                    <label>Select Payment Method</label>
                                    <Select
                                        options={paymentMethodOptions}
                                        onChange={(option) =>
                                            setSelectedPaymentMethod(option)
                                        }
                                        value={selectedPaymentMethod}
                                        isClearable={true}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.store_id}
                                        </p>
                                    )}
                                </div>

                                <div className="w-full mx-1 pt-2 float-right">
                                    {loading ? (
                                        <>
                                            <button
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                                disabled
                                            >
                                                {" "}
                                                <span className="fas fa-sync-alt animate-spin"></span>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={
                                                    handleVendorPreviewReport
                                                }
                                                className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                            >
                                                Submit
                                            </button>
                                        </>
                                    )}
                                </div>

                                <table className="w-full table-fixed mt-10">
                                    <thead>
                                        <tr className="border-b h-12">
                                            <th className="tableHeader ">
                                                SL. No.
                                            </th>
                                            <th className="tableHeader ">
                                                Store Name
                                            </th>
                                            <th className="tableHeader w-2/9">
                                                E-Mail
                                            </th>
                                            <th className="tableHeader ">
                                                Contact Person Name
                                            </th>
                                            <th className="tableHeader ">
                                                Mobile No
                                            </th>
                                            <th className="tableHeader ">
                                                Address
                                            </th>
                                            <th className="tableHeader ">
                                                Purchase
                                            </th>
                                            <th className="tableHeader ">
                                                Bank Info
                                            </th>
                                            <th className="tableHeader ">
                                                Active/Inactive
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {vendorReportPreview.map(
                                            (item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b py-4 h-20"
                                                >
                                                    <td>
                                                        <p className="">
                                                            {index + 1}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {item.STORE_NAME}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {item.E_MAIL}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {
                                                                item.CONTACT_PERSON_NAME
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {item.MOBILE_NO}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {item.ADDRESS}
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {
                                                                item.PURCHASE_METHOD
                                                            }
                                                        </p>
                                                    </td>

                                                    <td>
                                                        <p className="">
                                                            {item.BANK_INFO}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="">
                                                            {item.ACTIVE_INACTIVE
                                                                ? "Active"
                                                                : "Inactive"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                {vendorReportPreview.length > 0 && (
                                    <div className="w-full mx-1 pt-2 float-right">
                                        {loadingD ? (
                                            <>
                                                <button
                                                    className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                                    disabled
                                                >
                                                    {" "}
                                                    <span className="fas fa-sync-alt animate-spin"></span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={
                                                        handleVendorDownloadReport
                                                    }
                                                    className="float-right bg-blue-600 px-4 py-2 rounded text-white"
                                                >
                                                    Download
                                                </button>
                                            </>
                                        )}
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

export default VendorReport;
