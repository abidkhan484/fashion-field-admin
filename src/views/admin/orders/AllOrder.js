import axios from "axios";
import Pagination from "core/Pagination";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { permission } from "helper/permission";

import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

export default function AllOrder() {
    let { status } = useParams();

    if (status == undefined) {
        console.log("Its not");
    }

    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "order_history", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const [orders, setOrders] = React.useState([]);
    const [search, setSearch] = React.useState("");

    const fetchAllOrder = () => {
        if (status == undefined) {
            axios
                .get("/manage-orders", {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    console.log("💥", response.data);
                    setOrders(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        } else {
            axios
                .get(`/manage-orders?status=${status}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setOrders(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    };

    const updatePage = (url) => {
        // setLoading(true);
        axios
            .get(url, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                setOrders(response.data);
                // setLoading(false);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchAllOrder();
        }
    }, [token]);

    React.useEffect(() => {
        if (token != "") {
            fetchAllOrder();
        }
    }, [status]);

    React.useEffect(() => {
        if (search.length >= 3) {
            axios
                .get(`/manage-orders/${search}/search`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    // console.log(response);
                    setOrders(response.data);
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        } else {
            fetchAllOrder();
        }
    }, [search]);

    const [openDownload, setOpenDownload] = useState(false);
    const [startingData, setStartingDate] = useState("");
    const [endingData, setEndingDate] = useState("");
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [startingDataFilter, setStartingDateFilter] = useState("");
    const [endingDataFilter, setEndingDateFilter] = useState("");

    const handleCloseModal = () => {
        setOpenDownload(false);
        setStartingDate("");
        setEndingDate("");
    };

    const handleOpeningDownLoadModal = () => {
        setOpenDownload(true);
    };

    const handleDownloadButton = () => {
        if (!status) {
            setDownloadLoading(true);
            let url;
            if (startingData == "" || endingData == "") {
                url = `/exports/manage-orders`;
            } else {
                url = `/exports/manage-orders?from_date=${startingData}&to_date=${endingData}`;
            }
            axios
                .get(`${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    window.location.replace(response?.data?.url);
                    setStartingDate("");
                    setEndingDate("");
                    setOpenDownload(false);
                    setDownloadLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setStartingDate("");
                    setEndingDate("");
                    setOpenDownload(false);
                    setDownloadLoading(false);
                });
        } else {
            setDownloadLoading(true);
            let url;
            if (startingData == "" || endingData == "") {
                url = `/exports/manage-orders-status?status=${status}`;
            } else {
                url = `/exports/manage-orders-status?start_date=${startingData}&end_date=${endingData}&status=${status}`;
            }
            axios
                .get(`${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    window.location.replace(response?.data?.url);
                    setStartingDate("");
                    setEndingDate("");
                    setOpenDownload(false);
                    setDownloadLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setStartingDate("");
                    setEndingDate("");
                    setOpenDownload(false);
                    setDownloadLoading(false);
                });
        }
    };

    const handleOrderFilter = () => {
        if (status == undefined) {
            setDownloadLoading(true);
            let url;
            if (startingDataFilter == "" || endingDataFilter == "") {
                url = `/manage-orders`;
            } else {
                url = `/manage-orders?start_date=${startingDataFilter}&end_date=${endingDataFilter}`;
            }
            axios
                .get(`${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setOrders(response.data);
                    setStartingDateFilter("");
                    setEndingDateFilter("");
                    setDownloadLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setStartingDateFilter("");
                    setEndingDateFilter("");
                    setDownloadLoading(false);
                });
        } else {
            setDownloadLoading(true);
            let url;
            if (startingDataFilter == "" || endingDataFilter == "") {
                url = `/manage-orders?status=${status}`;
            } else {
                url = `/manage-orders?start_date=${startingDataFilter}&end_date=${endingDataFilter}&status=${status}`;
            }
            axios
                .get(`${url}`, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setOrders(response.data);
                    setStartingDateFilter("");
                    setEndingDateFilter("");
                    setDownloadLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setStartingDateFilter("");
                    setEndingDateFilter("");
                    setDownloadLoading(false);
                });
        }
    };

    useEffect(() => {
        console.log(startingData);
    }, [startingData]);

    return (
        <>
            <Modal
                open={openDownload}
                onClose={handleCloseModal}
                center
                blockScroll
            >
                <div className="py-6 px-4">
                    <div className="grid grid-cols-12 mb-6">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="startDate"
                                className="createFromInputLabel"
                            >
                                Starting Date
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="date"
                                id="startDate"
                                className="createFromInputField"
                                placeholder="Starting Date"
                                value={startingData}
                                onChange={(e) =>
                                    setStartingDate(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="endDate"
                                className="createFromInputLabel"
                            >
                                Ending Date
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="date"
                                id="endDate"
                                className="createFromInputField"
                                placeholder="Ending Date"
                                value={endingData}
                                onChange={(e) => setEndingDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {downloadLoading ? (
                        <>
                            <button
                                className="button button-outline-primary w-full mt-8"
                                disabled
                            >
                                {" "}
                                <span className="fas fa-sync-alt animate-spin"></span>
                            </button>
                        </>
                    ) : (
                        <div
                            className="button button-outline-primary cursor-pointer mt-8"
                            onClick={handleDownloadButton}
                        >
                            <p>Download</p>
                        </div>
                    )}
                </div>
            </Modal>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Orders</h1>
                    <div className="flex">
                        <div
                            className="button button-outline-primary w-48 cursor-pointer"
                            onClick={handleOpeningDownLoadModal}
                        >
                            <p>Download In Xlsx Format</p>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Orders</h4>
                            </div>
                            <div className="flex">
                                <div className="flex mr-10">
                                    <div className="flex items-center mr-4">
                                        <label
                                            htmlFor="startDateFilter"
                                            className="createFromInputLabel"
                                        >
                                            Starting Date
                                        </label>
                                        <input
                                            type="date"
                                            id="startDateFilter"
                                            className="createFromInputField"
                                            placeholder="Starting Date"
                                            value={startingDataFilter}
                                            onChange={(e) =>
                                                setStartingDateFilter(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center mr-6">
                                        <label
                                            htmlFor="endDateFilter"
                                            className="createFromInputLabel"
                                        >
                                            Ending Date
                                        </label>
                                        <input
                                            type="date"
                                            id="endDateFilter"
                                            className="createFromInputField"
                                            placeholder="Ending Date"
                                            value={endingDataFilter}
                                            onChange={(e) =>
                                                setEndingDateFilter(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    {downloadLoading ? (
                                        <>
                                            <button
                                                className="button button-outline-primary px-10 cursor-pointer"
                                                disabled
                                            >
                                                {" "}
                                                <span className="fas fa-sync-alt animate-spin"></span>
                                            </button>
                                        </>
                                    ) : (
                                        <div
                                            className="button button-outline-primary px-8 cursor-pointer"
                                            onClick={handleOrderFilter}
                                        >
                                            <p>Filter</p>
                                        </div>
                                    )}

                                    {/* <div className="button button-outline-primary px-8 cursor-pointer" onClick={handleOrderFilter}>
                                        <p>Filter</p>
                                    </div> */}
                                </div>

                                <input
                                    className="inputBox"
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                    placeholder="Order Number, Customer Name, Phone Number"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader">
                                        Order Number
                                    </th>
                                    <th className="tableHeader">
                                        Customer Name
                                    </th>
                                    <th className="tableHeader">
                                        Customer Phone
                                    </th>
                                    <th className="tableHeader">Order Date</th>
                                    {/* <th className="tableHeader">Last Update</th> */}
                                    <th className="tableHeader">Courier</th>
                                    <th className="tableHeader">
                                        Order Status
                                    </th>
                                    {status == "Hold" && (
                                        <th className="tableHeader">
                                            Special Note
                                        </th>
                                    )}
                                    <th className="tableHeader">Order Via</th>
                                    <th className="tableHeader text-center">
                                        Payment Status
                                    </th>
                                    <th className="tableHeader">
                                        Order Amount
                                    </th>
                                    <th className="tableHeader">
                                        Shipping Amount
                                    </th>
                                    <th className="tableHeader">
                                        Total Amount
                                    </th>
                                    <th className="tableHeader">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders?.data?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="border-b py-4 h-20"
                                    >
                                        <td>
                                            {user?.permissions &&
                                            (permission(
                                                user.permissions,
                                                "order_history",
                                                "read"
                                            ) ||
                                                user.user_type_id == 1) ? (
                                                <Link
                                                    to={`/admin/orders/${item.id}/details`}
                                                >
                                                    <p className="tableData uppercase">
                                                        <span className="font-bold">
                                                            {item.order_number}
                                                        </span>
                                                    </p>
                                                </Link>
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item?.shipping?.name}
                                            </p>
                                        </td>
                                        <td>
                                            {" "}
                                            <p className="tableData">
                                                {item?.shipping?.phone}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                <Moment format="D MMM YYYY">
                                                    {item.created_at}
                                                </Moment>
                                            </p>
                                        </td>
                                        {/* <td><p className="tableData"><Moment format="D MMM YYYY">{item.updated_at}</Moment></p></td> */}

                                        <td>
                                            <p className="tableData">
                                                {item?.courier?.name
                                                    ? item?.courier?.name
                                                    : "Not Assign"}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                {item.status}
                                            </p>
                                        </td>
                                        {status == "Hold" && (
                                            <td>
                                                <p className="tableData">
                                                    {item?.order_note}
                                                </p>
                                            </td>
                                        )}
                                        <td>
                                            <p className="tableData">
                                                {item.order_via != null
                                                    ? item.order_via
                                                    : item.order_via}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData uppercase text-center">
                                                <span className="bg-gray-200 p-1 rounded-full">
                                                    {item.set_paid == 1
                                                        ? "Paid"
                                                        : "Unpaid"}
                                                </span>
                                            </p>
                                        </td>

                                        <td>
                                            <p className="tableData">
                                                TK. {item.sub_total}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                TK. {item.shipping_total}
                                            </p>
                                        </td>
                                        <td>
                                            <p className="tableData">
                                                TK.{" "}
                                                {item.total -
                                                    item.partial_paid -
                                                    item.special_discount}
                                            </p>
                                        </td>

                                        <td>
                                            {user?.permissions &&
                                            (permission(
                                                user.permissions,
                                                "order_history",
                                                "read"
                                            ) ||
                                                user.user_type_id == 1) ? (
                                                <Link
                                                    to={`/admin/orders/${item.id}/details`}
                                                >
                                                    <i class="fas fa-edit"></i>
                                                </Link>
                                            ) : (
                                                ""
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {orders && (
                                <p className="font-Poppins font-normal text-sm">
                                    Showing{" "}
                                    <b>
                                        {orders.from} - {orders.to}
                                    </b>{" "}
                                    from <b>{orders.total}</b> data
                                </p>
                            )}

                            <div className="flex items-center">
                                {orders && (
                                    <Pagination
                                        sellers={orders}
                                        setUpdate={updatePage}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
