import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";
import { LoaderContext } from "context/LoaderContext";
import Pagination from "core/Pagination";
import { FaTrashAlt } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const SellerVerification = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { loading, setLoading } = React.useContext(LoaderContext);

    const [verificationList, setVerificationList] = useState([]);

    const history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "seller_management", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchVerificationList = () => {
        if (token != null && token != "") {
            setLoading(true);
            axios
                .get("/sellers/review/verification", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setVerificationList(response.data);
                    setLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchVerificationList();
    }, [token]);

    const handleApproveSeller = (id) => {
        setLoading(true);
        axios
            .post(
                `/approve/${id}/verification`,
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
                fetchVerificationList();
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    const handleRejectSellerDocument = (id) => {
        setLoading(true);

        axios
            .post(
                `/remove/${id}/verification`,
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
                fetchVerificationList();
                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors.response);
                setLoading(false);
            });
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">All Seller Verification List</h1>
            </div>

            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Verification List</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/5">
                                    Seller Name
                                </th>
                                <th className="tableHeader w-1/5">
                                    Seller Mobile
                                </th>
                                <th className="tableHeader w-0.5/5">
                                    Verification Type
                                </th>
                                <th className="tableHeader w-3/5 text-center">
                                    Verification Value
                                </th>
                                <th className="tableHeader w-1/5">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {verificationList?.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">
                                            {item?.vendor?.name}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.vendor?.mobile}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.item?.input_type}
                                        </p>
                                    </td>

                                    <td>
                                        <div className="h-full flex items-center justify-center">
                                            {item?.item?.input_type ==
                                            "text" ? (
                                                <p className="tableData">
                                                    {item?.value}
                                                </p>
                                            ) : (
                                                <img src={item?.value} />
                                            )}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="flex">
                                            <BsCheckCircleFill
                                                size={30}
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    handleApproveSeller(
                                                        item?.id
                                                    )
                                                }
                                            />
                                            <FaTrashAlt
                                                size={30}
                                                color="red"
                                                className="cursor-pointer ml-4"
                                                onClick={() =>
                                                    handleRejectSellerDocument(
                                                        item?.id
                                                    )
                                                }
                                            />
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

export default SellerVerification;
