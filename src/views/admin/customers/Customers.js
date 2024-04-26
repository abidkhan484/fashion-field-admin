import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "core/Pagination";
import CustomerComponent from "components/Customer/CustomerComponent";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

export default function Customers() {
    const { token, user } = useSelector((state) => state.auth);

    const [customers, setCustomers] = useState([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const paymentOptions = [
        { value: "bank", label: "Bank" },
        { value: "nagad", label: "Nagad" },
        { value: "bkash", label: "Bkash" },
        { value: "cash", label: "Cash" },
    ];

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "customers", "read") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchCustomers = (search) => {
        axios
            .get(`/customers?search=${search}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((errors) => {
                console.log(errors.response);
            });
    };

    const updatePage = (url) => {
        axios
            .get(url.concat(`&search=${customerSearch}`), {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                setCustomers(response.data);
            });
    };

    const updateCustomerInfo = (customer) => {
        let cloneObject = Object.assign({}, customers);
        let cloneCustomers = [...customers["data"]];
        let index = cloneCustomers.findIndex((cus) => cus.id === customer.id);
        cloneCustomers[index]["wallet"]["amount"] = customer["balance"];
        cloneObject["data"] = cloneCustomers;
        setCustomers(cloneObject);
    };

    useEffect(() => {
        if (token != "") {
            fetchCustomers(customerSearch);
        }
    }, [token, customerSearch]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">All Customer</h1>
                    <div className="flex"></div>
                </div>

                <div className="card">
                    <div className="border-b">
                        <div className="card-header flex flex-row">
                            <div className="w-full mb-2">
                                <h4 className="pageHeading">Customer List</h4>
                            </div>
                            <input
                                className="inputBox ml-5"
                                placeholder="Search"
                                onChange={(e) =>
                                    setCustomerSearch(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="card-body">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader">Name</th>
                                    <th className="tableHeader">Mobile</th>
                                    <th className="tableHeader">Email</th>
                                    <th className="tableHeader">Status</th>
                                    <th className="tableHeader">
                                        Total Orders
                                    </th>
                                    <th className="tableHeader">
                                        Wallet Amount
                                    </th>
                                    <th className="tableHeader">
                                        Refund Wallet
                                    </th>
                                    <th className="tableHeader">
                                        Refund Transaction
                                    </th>
                                    <th className="tableHeader">
                                        Wallet Transaction
                                    </th>
                                    <th className="tableHeader">
                                        Order Alignment
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers?.data?.map((customer, index) => (
                                    <CustomerComponent
                                        key={index}
                                        customer={customer}
                                        axios={axios}
                                        token={token}
                                        paymentOptions={paymentOptions}
                                        updateCustomerInfo={updateCustomerInfo}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer">
                        <div className="flex flex-col justify-between md:flex-row items-center w-full">
                            {customers && (
                                <p className="font-Poppins font-normal text-sm">
                                    Showing{" "}
                                    <b>
                                        {customers.from} - {customers.to}
                                    </b>{" "}
                                    from <b>{customers.total}</b> data
                                </p>
                            )}

                            <div className="flex items-center">
                                {customers && (
                                    <Pagination
                                        sellers={customers}
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
