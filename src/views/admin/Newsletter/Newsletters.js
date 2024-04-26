import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

export default function Newsletters() {
    const { token, user } = useSelector((state) => state.auth);
    const [emails, setEmails] = React.useState([]);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "newsletters", "access") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchEmails = () => {
        axios
            .get(`newsletters`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setEmails(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchEmails();
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">All Subscriber</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">
                                Newsletter Subscribers
                            </h4>
                        </div>
                        {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                        {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader w-12">ID</th>
                                <th className="tableHeader">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails?.map((item, index) => (
                                <tr key={index} className="border-b py-4 h-20">
                                    <td>
                                        <p className="tableData uppercase">
                                            <span className="font-bold">
                                                {item.id}
                                            </span>
                                        </p>
                                    </td>
                                    <td>
                                        <p className="tableData">
                                            {item.email}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
