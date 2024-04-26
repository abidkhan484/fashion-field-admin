import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import PermissionItem from "./PermissionItem";
import BannerCategory from "./permissions/BannerCategory";
import BannerHomepage from "./permissions/BannerHomepage";
import { permission } from "helper/permission";

export default function UserPermission() {
    const [permissions, setPermissions] = React.useState([]);

    let { id } = useParams();
    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "system_user", "update") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    // const fetchUser = () => {
    //     axios.get(`users/${id}`, {
    //         headers: {
    //             Accept: 'application/json',
    //             Authorization: token
    //         }
    //     }).then(response => {
    //         // console.log(response);
    //         setUser(user);
    //     }).catch(error => {
    //         console.log(error.response);
    //     })
    // }

    const fetchPermissions = () => {
        axios
            .get(`user/${id}/permissions`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                // console.log(response);
                setPermissions(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    // React.useEffect(() => {
    //     let item = permissions.filter((item) => item.menu_item == "banner_homepage")
    //     console.log(item.length);
    // }, [permissions])

    React.useEffect(() => {
        if (token != "") {
            // fetchUser();
            fetchPermissions();
        }
    }, [token]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">User Permission</h1>
                    <div className="flex">
                        <Link
                            to="/admin/users"
                            className="button bg-blue-400 text-white px-4"
                        >
                            Back to Users
                        </Link>
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Permissions</h4>
                            </div>
                            {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                            {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <table className="w-350 2xl:w-full table-fixed">
                            <thead>
                                <tr className="border-b h-12">
                                    <th className="tableHeader">Name</th>
                                    <th className="tableHeader">Create</th>
                                    <th className="tableHeader">Read</th>
                                    <th className="tableHeader">Update</th>
                                    <th className="tableHeader">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b h-12">
                                    <td className="font-bold">Dashboard</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <PermissionItem
                                    type="reports_shipment_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_logistic_requisition_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_sales_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_payment_method_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_vendor_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_return_report"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="reports_cancel_report"
                                    user={id}
                                    permissions={permissions}
                                />

                                <PermissionItem
                                    type="banner_homepage"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="banner_category"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="banner_sub_category"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="seller_management"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="supplier_management"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="campaigns"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_category"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_brands"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_attributes"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_manage_product"
                                    user={id}
                                    permissions={permissions}
                                />
                                {/* <PermissionItem
                                    type="products_all_products"
                                    user={id}
                                    permissions={permissions}
                                /> */}
                                <PermissionItem
                                    type="products_deals_of_the_day"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_best_seller"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="products_size_chart"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="customers"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="navigation"
                                    user={id}
                                    permissions={permissions}
                                />

                                <PermissionItem
                                    type="homepage_product_groups"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="menu_management"
                                    user={id}
                                    permissions={permissions}
                                />

                                <PermissionItem
                                    type="homepage_categories"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="product_reviews"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="system_user"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="couriers"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="pages"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="settings"
                                    user={id}
                                    permissions={permissions}
                                />
                                {/* <PermissionItem
                                    type="order_history"
                                    user={id}
                                    permissions={permissions}
                                /> */}
                                <PermissionItem
                                    type="order_history"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="order_pos_system"
                                    user={id}
                                    permissions={permissions}
                                />

                                <PermissionItem
                                    type="refund_pannel"
                                    user={id}
                                    permissions={permissions}
                                />

                                <PermissionItem
                                    type="shipping_management"
                                    user={id}
                                    permissions={permissions}
                                />
                                {/* <PermissionItem
                                    type="offers_discount"
                                    user={id}
                                    permissions={permissions}
                                /> */}
                                <PermissionItem
                                    type="offers_coupon"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="offers_manage_offer"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="payouts"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="newsletters"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="faqs"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="testimonial"
                                    user={id}
                                    permissions={permissions}
                                />
                                <PermissionItem
                                    type="contact"
                                    user={id}
                                    permissions={permissions}
                                />
                                {/* <BannerHomepage type="banner_homepage" user={user} />
                                <BannerCategory user={user} /> */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
