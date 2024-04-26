import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { permission } from "helper/permission";

const BestSeller = () => {
    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "products_best_seller",
                    "access"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const [bestsellers, setBestSellers] = useState([]);

    const fetchBestSeller = () => {
        axios
            .get("/bestseller", {
                headers: {
                    Authorization: token,
                    Accept: "application/json",
                },
            })
            .then((response) => {
                setBestSellers(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    useEffect(() => {
        if (token != "") {
            fetchBestSeller();
        }
    }, [token]);

    const deletetBestseller = (id) => {
        console.log(id);
        if (!window.confirm("Are you want to do it?")) return false;

        if (token != "") {
            axios
                .delete(`/bestseller/${id}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    fetchBestSeller();
                })
                .catch((errors) => {
                    console.log(errors.response);
                });
        }
    };

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Best Sellers</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Best Seller</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-1/9">
                                    Product ID
                                </th>
                                <th className="tableHeader w-1/9">
                                    Product Name
                                </th>
                                <th className="tableHeader w-1/9 ">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bestsellers?.map((item, index) => (
                                <tr className="border-b py-4 h-20" key={index}>
                                    <td>
                                        <p className="tableData">
                                            {item?.product?.id}
                                        </p>
                                    </td>
                                    <td>
                                        <p className="tableData">
                                            {item?.product?.name}
                                        </p>
                                    </td>

                                    <td className="text-center">
                                        <div className="h-full flex items-center justify-between">
                                            <Link
                                                onClick={() => {
                                                    deletetBestseller(item.id);
                                                }}
                                            >
                                                <i
                                                    className="fas fa-trash"
                                                    style={{ color: "red" }}
                                                ></i>
                                            </Link>
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

export default BestSeller;
