import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BsCheckCircleFill } from "react-icons/bs";
import { LoaderContext } from "context/LoaderContext";
import Pagination from "core/Pagination";
import toast from "react-hot-toast";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const SellerRequestList = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { loading, setLoading } = React.useContext(LoaderContext);

    const [sellerRequest, setSellerRequest] = useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "seller_management", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    useEffect(() => {
        if (token != null && token != "") {
            setLoading(true);
            axios
                .get("/seller-account-request", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setSellerRequest(response.data);
                    setLoading(false);
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    }, [token]);

    const updatePage = (url) => {
        setLoading(true);
        axios
            .get(url, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                setSellerRequest(response.data);
                setLoading(false);
            });
    };

    const handleAcceptingSellerRequest = (id) => {
        if (token != null && token != "") {
            setLoading(true);
            axios
                .post(
                    `/seller-account-request/${id}`,
                    {
                        status: 1,
                        _method: "PUT",
                    },
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    // toast.success('Seller Accepted');
                    axios
                        .get("/seller-account-request", {
                            headers: {
                                Authorization: token,
                                Accept: "application/json",
                            },
                        })
                        .then((response) => {
                            // console.log(response)
                            setSellerRequest(response.data);
                            setLoading(false);
                        })
                        .catch((errors) => {
                            // console.log(errors.response)
                            setLoading(false);
                        });
                })
                .catch((errors) => {
                    console.log(errors.response);
                    setLoading(false);
                });
        }
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">All Seller Request</h1>
            </div>

            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Seller Request</h4>
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
                                <th className="tableHeader w-1/5">
                                    Seller Email
                                </th>
                                <th className="tableHeader w-1/5">
                                    Seller Store Name
                                </th>
                                <th className="tableHeader w-1/5">
                                    Accept Seller Request
                                </th>
                                {/* <th className="tableHeader w-1/7">Status</th>
                                <th className="tableHeader w-1/7">Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {sellerRequest?.data?.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">
                                            {item?.name}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.mobile}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.email}
                                        </p>
                                    </td>

                                    <td>
                                        <p className="tableData">
                                            {item?.store?.name}
                                        </p>
                                    </td>

                                    <td>
                                        <BsCheckCircleFill
                                            size={30}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleAcceptingSellerRequest(
                                                    item?.id
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer">
                    <div className="flex flex-col justify-between md:flex-row items-center w-full">
                        {sellerRequest && (
                            <p className="font-Poppins font-normal text-sm">
                                Showing{" "}
                                <b>
                                    {sellerRequest.from} - {sellerRequest.to}
                                </b>{" "}
                                from <b>{sellerRequest.total}</b> data
                            </p>
                        )}

                        <div className="flex items-center">
                            {sellerRequest && (
                                <Pagination
                                    sellers={sellerRequest}
                                    setUpdate={updatePage}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRequestList;
