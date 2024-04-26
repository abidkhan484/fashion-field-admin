import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const RefundRequest = () => {
    const { token, user } = useSelector((state) => state.auth);

    const [refundData, setRefundData] = useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "refund_pannel", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchRefundData = () => {
        axios
            .get("/refunds/request", {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                console.log(response);
                setRefundData(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    useEffect(() => {
        if (token != "") {
            fetchRefundData();
        }
    }, [token]);

    const handleBankTransfer = (id) => {
        console.log(id);
        axios
            .post(
                `/refunds/${id}/transfer-bank`,
                {},
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                fetchRefundData();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const handleAccountTransfer = (id) => {
        console.log(id);
        axios
            .post(
                `/refunds/${id}/transfer-balance`,
                {},
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                fetchRefundData();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const handleRejectRefund = (id) => {
        console.log(id);
        axios
            .post(
                `/refunds/${id}/reject`,
                {},
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                fetchRefundData();
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading w-full mb-2">Refund Pannel</h1>
            </div>

            <div className="card">
                <div className="border-b">
                    <div className="card-header flex flex-row">
                        <div className="w-full mb-2">
                            <h4 className="pageHeading">Refunds Requests</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Customer Info</th>
                                <th className="tableHeader">Item Image</th>
                                <th className="tableHeader">Item Info</th>
                                <th className="tableHeader">Refund Info</th>
                                <th className="tableHeader">
                                    Money Transfer Info
                                </th>
                                <th className="tableHeader text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {refundData.map((item, index) => (
                                <tr className="border-b" key={index}>
                                    <td>
                                        <div className="py-2">
                                            <p className="tableData">
                                                <span className="font-bold">
                                                    Name:
                                                </span>{" "}
                                                {item?.shipping?.name}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Mobile:
                                                </span>{" "}
                                                {item?.shipping?.phone}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Region:
                                                </span>{" "}
                                                {item?.shipping?.region}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    City:
                                                </span>{" "}
                                                {item?.shipping?.city}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Area:
                                                </span>{" "}
                                                {item?.shipping?.area}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Address:
                                                </span>{" "}
                                                {item?.shipping?.address}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Company Name:
                                                </span>{" "}
                                                {item?.shipping?.company_name}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Department:
                                                </span>{" "}
                                                {item?.shipping?.department}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Designation:
                                                </span>{" "}
                                                {item?.shipping?.designation}
                                            </p>
                                        </div>
                                    </td>

                                    <td>
                                        <img
                                            className="w-1/2 h-1/2"
                                            src={item?.item?.product?.thumbnail}
                                        />
                                    </td>

                                    <td>
                                        <div className="py-2 pr-20">
                                            <p className="tableData">
                                                <span className="font-bold">
                                                    Name:
                                                </span>{" "}
                                                {item?.item?.product?.name}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    SKU:
                                                </span>{" "}
                                                {item?.item?.product?.SKU}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Brand Name:
                                                </span>{" "}
                                                {
                                                    item?.item?.product
                                                        ?.brand_name
                                                }
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Store Name:
                                                </span>{" "}
                                                {
                                                    item?.item?.product
                                                        ?.store_name
                                                }
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Style No:
                                                </span>{" "}
                                                {item?.item?.product?.style_no}
                                            </p>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="py-2">
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Quantity:
                                                </span>{" "}
                                                {item?.quantity}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Unit Price:
                                                </span>{" "}
                                                {item?.unit_price}
                                            </p>
                                            <p className="tableData mt-1">
                                                <span className="font-bold">
                                                    Amount:
                                                </span>{" "}
                                                {item?.amount}
                                            </p>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="py-2">
                                            {item?.bank_name &&
                                            item?.branch_name &&
                                            item?.account_name &&
                                            item?.account_number ? (
                                                <>
                                                    <p className="tableData mt-1">
                                                        <span className="font-bold">
                                                            Bank Name:
                                                        </span>{" "}
                                                        {item?.bank_name}
                                                    </p>
                                                    <p className="tableData mt-1">
                                                        <span className="font-bold">
                                                            Branch Name:
                                                        </span>{" "}
                                                        {item?.branch_name}
                                                    </p>
                                                    <p className="tableData mt-1">
                                                        <span className="font-bold">
                                                            Account Name:
                                                        </span>{" "}
                                                        {item?.account_name}
                                                    </p>
                                                    <p className="tableData mt-1">
                                                        <span className="font-bold">
                                                            Account Number:
                                                        </span>{" "}
                                                        {item?.account_number}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="tableData mt-1">
                                                    <span className="font-bold">
                                                        Transfer money in
                                                        Personal Account
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="py-2 flex">
                                            {item?.is_account_balance ? (
                                                <button
                                                    onClick={() =>
                                                        handleAccountTransfer(
                                                            item?.id
                                                        )
                                                    }
                                                    className="float-right bg-blue-600 px-2 py-2 rounded text-white"
                                                >
                                                    Account Transfer
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleBankTransfer(
                                                            item?.id
                                                        )
                                                    }
                                                    className="float-right bg-blue-600 px-2 py-2 rounded text-white"
                                                >
                                                    Bank Transfer
                                                </button>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleRejectRefund(item?.id)
                                                }
                                                className="float-right bg-red-600 px-2 py-2 rounded text-white ml-2"
                                            >
                                                Reject Refund
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RefundRequest;
