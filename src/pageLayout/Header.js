//import useState hook to create menu collapse state
import React, { useState } from "react";

//import react pro sidebar components
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
    SubMenu,
} from "react-pro-sidebar";

//import icons from react icons
import { FaList, FaRegHeart } from "react-icons/fa";
import {
    FiHome,
    FiLogOut,
    FiArrowLeftCircle,
    FiArrowRightCircle,
} from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { GrDashboard } from "react-icons/gr";
import { MdOutlineSummarize } from "react-icons/md";
import { BsPersonCheck, BsPersonPlus } from "react-icons/bs";
import { SiBrandfolder } from "react-icons/si";
import { RiListSettingsFill } from "react-icons/ri";

//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";
import { Link } from "react-router-dom";

import CompanyLogo from "../assets/img/favicon.png";

import { activeNav } from "navhelper";
import { useSelector } from "react-redux";

import { permission } from "helper/permission";

const Header = (props) => {
    const { user } = useSelector((state) => state.auth);

    //create initial menuCollapse state using useState hook
    const { menuCollapse, setMenuCollapse } = props;

    //create a custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = () => {
        //condition checking to change state from true to false and vice versa
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };

    // React.useEffect(() => {
    //     console.log(user?.permissions && permission(user.permissions, 'banner_homepage', 'create'));
    // }, [user])

    return (
        <>
            <div id="header">
                {/* collapsed props to change menu size using menucollapse state */}
                <ProSidebar collapsed={menuCollapse}>
                    <SidebarHeader>
                        <div className="px-6 py-4 flex items-center">
                            {menuCollapse === false ? (
                                <div className="flex items-center">
                                    <div
                                        onClick={menuIconClick}
                                        className="w-10 h-10"
                                    >
                                        <img
                                            src={CompanyLogo}
                                            alt="company Name"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-Poppins font-bold text-xl truncate">
                                            Fashion Field
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={menuIconClick}
                                    className="w-10 h-10"
                                >
                                    <img
                                        src={CompanyLogo}
                                        alt="company Name"
                                        className="w-full h-full"
                                    />
                                </div>
                            )}
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <Menu iconShape="circle">
                            <MenuItem
                                icon={<MdOutlineSummarize />}
                                active={activeNav("/admin/dashboard")}
                            >
                                <Link
                                    to="/admin/dashboard"
                                    className={`${activeNav("/admin/dashboard")
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Dashbord
                                </Link>
                            </MenuItem>

                            <SubMenu
                                title="Report"
                                icon={<FaList />}
                                className="font-Poppins"
                            >
                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/order-report"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/order-report"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/order-report"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Shipment Reports
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/logistic-requisition-report"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/logistic-requisition-report"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/logistic-requisition-report"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Logistic Requisition Report
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/sales-report"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/sales-report"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/sales-report"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Sales Report
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/payment-method"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/payment-method"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/payment-method"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Payment Method Report
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/vendor"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/vendor"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/vendor"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Vendor Report
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/return-product-report"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/return-product-report"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/return-product-report"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Return Product Report
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reports/cancelled-order-report"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reports/cancelled-order-report"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reports/cancelled-order-report"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Cancelled Order Report
                                    </Link>
                                </MenuItem>

                                {/* <MenuItem icon={<SiBrandfolder />} active={window.location.href.indexOf("/admin/reports/stock") !== -1 ? true : false}>
                                    <Link to="/admin/reports/stock" className={`${window.location.href.indexOf("/admin/reports/stock") !== -1 ? "font-Poppins font-bold" : "font-Poppins"}`}>Stock Report</Link>
                                </MenuItem> */}
                            </SubMenu>

                            <SubMenu
                                title="Banners Sliders"
                                icon={<FaList />}
                                className="font-Poppins"
                            >
                                <MenuItem
                                    icon={<FaList />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/homepageBanner"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/homepageBanner"
                                        className={`${window.location.href.indexOf(
                                            "/admin/homepageBanner"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Home Page
                                    </Link>
                                </MenuItem>
                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/categoryBanner"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/categoryBanner"
                                        className={`${window.location.href.indexOf(
                                            "/admin/categoryBanner"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Category
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/subcategoryBanner"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/subcategoryBanner"
                                        className={`${window.location.href.indexOf(
                                            "/admin/subcategoryBanner"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        SubCategory
                                    </Link>
                                </MenuItem>

                            </SubMenu>

                            <SubMenu
                                title="Seller"
                                icon={<FaList />}
                                className="font-Poppins"
                            >
                                <MenuItem
                                    icon={<BsPersonCheck />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/sellers"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/sellers"
                                        className={`${window.location.href.indexOf(
                                            "/admin/sellers"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Seller
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<BsPersonCheck />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/seller/request"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/seller/request"
                                        className={`${window.location.href.indexOf(
                                            "/admin/seller/request"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Seller Request
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<BsPersonCheck />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/seller-settings"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/seller-settings"
                                        className={`${window.location.href.indexOf(
                                            "/admin/seller-settings"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Seller Settings
                                    </Link>
                                </MenuItem>

                                <MenuItem
                                    icon={<BsPersonCheck />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/seller-verification"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/seller-verification"
                                        className={`${window.location.href.indexOf(
                                            "/admin/seller-verification"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Seller Verification
                                    </Link>
                                </MenuItem>
                            </SubMenu>
                            <MenuItem
                                icon={<BsPersonPlus />}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/suppliers"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/suppliers"
                                    className={`${window.location.href.indexOf(
                                        "/admin/suppliers"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Suppliers
                                </Link>
                            </MenuItem>

                            <MenuItem
                                icon={<BsPersonPlus />}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/campaign"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/campaign"
                                    className={`${window.location.href.indexOf(
                                        "/admin/campaign"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Campaigns
                                </Link>
                            </MenuItem>
                            <SubMenu
                                title="Product"
                                icon={<FaList />}
                                className="font-Poppins"
                                active={activeNav("/admin/suppliers")}
                            >
                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_category",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/categories"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/categories"
                                            className={`${window.location.href.indexOf(
                                                "/admin/categories"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Category
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_brands",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/brands"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/brands"
                                            className={`${window.location.href.indexOf(
                                                "/admin/brands"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Brands
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_attributes",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<RiListSettingsFill />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/attributes"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/attributes"
                                            className={`${window.location.href.indexOf(
                                                "/admin/attributes"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Attributes
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_manage_product",
                                        "create"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<RiPencilLine />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/products-adding"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/products-adding"
                                            className={`${window.location.href.indexOf(
                                                "/admin/products-adding"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Add Product
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_manage_product",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/all-products"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/all-products"
                                            className={`${window.location.href.indexOf(
                                                "/admin/all-products"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            All Products
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_deals_of_the_day",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/deals"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/deals"
                                            className={`${window.location.href.indexOf(
                                                "/admin/deals"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Deals of the Day
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                {user?.permissions &&
                                    (permission(
                                        user.permissions,
                                        "products_best_seller",
                                        "access"
                                    ) ||
                                        user.user_type_id == 1) ? (
                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/bestellers"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/bestellers"
                                            className={`${window.location.href.indexOf(
                                                "/admin/bestellers"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Best Seller
                                        </Link>
                                    </MenuItem>
                                ) : (
                                    ""
                                )}

                                <MenuItem
                                    icon={<FaList />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/sizechart"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/sizechart"
                                        className={`${window.location.href.indexOf(
                                            "/admin/sizechart"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Size Chart
                                    </Link>
                                </MenuItem>
                            </SubMenu>

                            <MenuItem
                                icon={<i className="fas fa-users"></i>}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/customers"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/customers"
                                    className={`${window.location.href.indexOf(
                                        "/admin/customers"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Customers Wallet
                                </Link>
                            </MenuItem>

                            <MenuItem
                                icon={<i className="far fa-compass"></i>}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/navigation"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/navigation"
                                    className={`${window.location.href.indexOf(
                                        "/admin/navigation"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Navigation
                                </Link>
                            </MenuItem>

                            <MenuItem
                                icon={<i className="far fa-compass"></i>}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/homepage-prouduct-group"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/homepage-prouduct-group"
                                    className={`${window.location.href.indexOf(
                                        "/admin/homepage-prouduct-group"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    HomePage Product Group
                                </Link>
                            </MenuItem>

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "menu_management",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={<i className="far fa-compass"></i>}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/manumanage"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/manumanage"
                                        className={`${window.location.href.indexOf(
                                            "/admin/manumanage"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Menu Management
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "homepage_categories",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={<i class="fas fa-laptop-house"></i>}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/homepage/categories"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/homepage/categories"
                                        className={`${window.location.href.indexOf(
                                            "/admin/homepage/categories"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Homepage Categories
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "product_reviews",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={
                                        <i className="fas fa-star-half-alt"></i>
                                    }
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/reviews"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/reviews"
                                        className={`${window.location.href.indexOf(
                                            "/admin/reviews"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Product Reviews
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {/* Need to Add leter */}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "system_user",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={
                                        <span className="fas fa-user-cog"></span>
                                    }
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/users"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/users"
                                        className={`${window.location.href.indexOf(
                                            "/admin/users"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        System User
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "couriers",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={
                                        <span className="fas fa-shipping-fast"></span>
                                    }
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/couriers"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/couriers"
                                        className={`${window.location.href.indexOf(
                                            "/admin/couriers"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Couriers
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(user.permissions, "pages", "access") ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={
                                        <span className="fas fa-pager"></span>
                                    }
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/page"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/page"
                                        className={`${window.location.href.indexOf(
                                            "/admin/page"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Pages
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "navigation",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={<i className="far fa-compass"></i>}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/socialmenu"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/socialmenu"
                                        className={`${window.location.href.indexOf(
                                            "/admin/socialmenu"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Setting
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "order_history",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <SubMenu
                                    title="Order Info"
                                    icon={
                                        <i className="fas fa-shopping-cart"></i>
                                    }
                                    className="font-Poppins"
                                    active={activeNav("/admin/suppliers")}
                                >
                                    <MenuItem
                                        icon={<i className="fas fa-list"></i>}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            All Orders
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={
                                            <i className="fas fa-spinner"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Processing"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Processing"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Processing"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Processing
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={
                                            <i className="fas fa-clipboard-check"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Approve"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Approve"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Approve"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Approved
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={
                                            <i className="fas fa-clipboard-check"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Hold"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Hold"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Hold"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Hold
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={
                                            <i className="fas fa-shipping-fast"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/On%20Shipping"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/On Shipping"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/On%20Shipping"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            On Shipping
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i className="fas fa-people-carry"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Shipped"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Shipped"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Shipped"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Shipped
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i className="far fa-calendar-times"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Cancelled"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Cancelled"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Cancelled"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Cancelled
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i className="fas fa-undo-alt"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Return"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Return"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Return"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Returned
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i className="fas fa-check-double"></i>
                                        }
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/orders/Completed"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/orders/Completed"
                                            className={`${window.location.href.indexOf(
                                                "/admin/orders/Completed"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Completed
                                        </Link>
                                    </MenuItem>

                                    {user?.permissions &&
                                        (permission(
                                            user.permissions,
                                            "order_pos_system",
                                            "access"
                                        ) ||
                                            user.user_type_id == 1) ? (
                                        <MenuItem
                                            icon={
                                                <i className="fas fa-check-double"></i>
                                            }
                                            active={
                                                window.location.href.indexOf(
                                                    "/admin/pos-system"
                                                ) !== -1
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <Link
                                                to="/admin/pos-system"
                                                className={`${window.location.href.indexOf(
                                                    "/admin/pos-system"
                                                ) !== -1
                                                    ? "font-Poppins font-bold"
                                                    : "font-Poppins"
                                                    }`}
                                            >
                                                POS System
                                            </Link>
                                        </MenuItem>
                                    ) : (
                                        ""
                                    )}
                                </SubMenu>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "refund_pannel",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <SubMenu
                                    title="Refund Pannal"
                                    icon={<FaList />}
                                    className="font-Poppins"
                                >
                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/refund-request"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/refund-request"
                                            className={`${window.location.href.indexOf(
                                                "/admin/refund-request"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Refund Request
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/refund/success"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/refund/success"
                                            className={`${window.location.href.indexOf(
                                                "/admin/refund/success"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Refund Success
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/refund/rejected"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/refund/rejected"
                                            className={`${window.location.href.indexOf(
                                                "/admin/refund/rejected"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Refund Rejected
                                        </Link>
                                    </MenuItem>
                                </SubMenu>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "shipping_management",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={
                                        <i className="fas fa-dolly-flatbed"></i>
                                    }
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/shipping/class"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/shipping/class"
                                        className={`${window.location.href.indexOf(
                                            "/admin/shipping/class"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        Shipping Classes
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "offers_coupon",
                                    "access"
                                ) ||
                                    permission(
                                        user.permissions,
                                        "offers_manage_offer",
                                        "access"
                                    ) ||
                                    user.user_type_id == 1) ? (
                                <SubMenu
                                    title="Offers & Discount"
                                    icon={<FaList />}
                                    className="font-Poppins"
                                >
                                    {user?.permissions &&
                                        (permission(
                                            user.permissions,
                                            "offers_coupon",
                                            "create"
                                        ) ||
                                            user.user_type_id == 1) ? (
                                        <MenuItem
                                            icon={<FaList />}
                                            active={
                                                window.location.href.indexOf(
                                                    "/admin/cupon"
                                                ) !== -1
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <Link
                                                to="/admin/cupon"
                                                className={`${window.location.href.indexOf(
                                                    "/admin/cupon"
                                                ) !== -1
                                                    ? "font-Poppins font-bold"
                                                    : "font-Poppins"
                                                    }`}
                                            >
                                                Set Cupon
                                            </Link>
                                        </MenuItem>
                                    ) : (
                                        ""
                                    )}

                                    {user?.permissions &&
                                        (permission(
                                            user.permissions,
                                            "offers_coupon",
                                            "access"
                                        ) ||
                                            user.user_type_id == 1) ? (
                                        <MenuItem
                                            icon={<SiBrandfolder />}
                                            active={
                                                window.location.href.indexOf(
                                                    "/admin/allCupons"
                                                ) !== -1
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <Link
                                                to="/admin/allCupons"
                                                className={`${window.location.href.indexOf(
                                                    "/admin/allCupons"
                                                ) !== -1
                                                    ? "font-Poppins font-bold"
                                                    : "font-Poppins"
                                                    }`}
                                            >
                                                All Cupons
                                            </Link>
                                        </MenuItem>
                                    ) : (
                                        ""
                                    )}

                                    {user?.permissions &&
                                        (permission(
                                            user.permissions,
                                            "offers_manage_offer",
                                            "access"
                                        ) ||
                                            user.user_type_id == 1) ? (
                                        <MenuItem
                                            icon={<SiBrandfolder />}
                                            active={
                                                window.location.href.indexOf(
                                                    "/admin/offers"
                                                ) !== -1
                                                    ? true
                                                    : false
                                            }
                                        >
                                            <Link
                                                to="/admin/offers"
                                                className={`${window.location.href.indexOf(
                                                    "/admin/offers"
                                                ) !== -1
                                                    ? "font-Poppins font-bold"
                                                    : "font-Poppins"
                                                    }`}
                                            >
                                                Offers
                                            </Link>
                                        </MenuItem>
                                    ) : (
                                        ""
                                    )}
                                </SubMenu>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "payouts",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <SubMenu
                                    title="Payout"
                                    icon={<FaList />}
                                    className="font-Poppins"
                                >
                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/payoutpending"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/payoutpending"
                                            className={`${window.location.href.indexOf(
                                                "/admin/payoutpending"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Pending Payouts
                                        </Link>
                                    </MenuItem>

                                    <MenuItem
                                        icon={<FaList />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/payouthistory"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/payouthistory"
                                            className={`${window.location.href.indexOf(
                                                "/admin/payouthistory"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Payout History
                                        </Link>
                                    </MenuItem>
                                </SubMenu>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(
                                    user.permissions,
                                    "newsletters",
                                    "access"
                                ) ||
                                    user.user_type_id == 1) ? (
                                <SubMenu
                                    title="Newsletters"
                                    icon={<FaList />}
                                    className="font-Poppins"
                                >
                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/newsletters"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/newsletters"
                                            className={`${window.location.href.indexOf(
                                                "/admin/newsletters"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Subscribers
                                        </Link>
                                    </MenuItem>
                                    <MenuItem
                                        icon={<SiBrandfolder />}
                                        active={
                                            window.location.href.indexOf(
                                                "/admin/newsletters/send"
                                            ) !== -1
                                                ? true
                                                : false
                                        }
                                    >
                                        <Link
                                            to="/admin/newsletters/send"
                                            className={`${window.location.href.indexOf(
                                                "/admin/newsletters/send"
                                            ) !== -1
                                                ? "font-Poppins font-bold"
                                                : "font-Poppins"
                                                }`}
                                        >
                                            Send Newsletter
                                        </Link>
                                    </MenuItem>
                                </SubMenu>
                            ) : (
                                ""
                            )}

                            {user?.permissions &&
                                (permission(user.permissions, "faqs", "access") ||
                                    user.user_type_id == 1) ? (
                                <MenuItem
                                    icon={<SiBrandfolder />}
                                    active={
                                        window.location.href.indexOf(
                                            "/admin/faqs"
                                        ) !== -1
                                            ? true
                                            : false
                                    }
                                >
                                    <Link
                                        to="/admin/faqs"
                                        className={`${window.location.href.indexOf(
                                            "/admin/faqs"
                                        ) !== -1
                                            ? "font-Poppins font-bold"
                                            : "font-Poppins"
                                            }`}
                                    >
                                        FAQ's
                                    </Link>
                                </MenuItem>
                            ) : (
                                ""
                            )}

                            <MenuItem
                                icon={<SiBrandfolder />}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/testimonials"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/testimonials"
                                    className={`${window.location.href.indexOf(
                                        "/admin/testimonials"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Testimonial
                                </Link>
                            </MenuItem>

                            <MenuItem
                                icon={<SiBrandfolder />}
                                active={
                                    window.location.href.indexOf(
                                        "/admin/contact"
                                    ) !== -1
                                        ? true
                                        : false
                                }
                            >
                                <Link
                                    to="/admin/contact"
                                    className={`${window.location.href.indexOf(
                                        "/admin/contact"
                                    ) !== -1
                                        ? "font-Poppins font-bold"
                                        : "font-Poppins"
                                        }`}
                                >
                                    Contact
                                </Link>
                            </MenuItem>
                        </Menu>
                    </SidebarContent>
                    {/* <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
                        </Menu>
                    </SidebarFooter> */}
                </ProSidebar>
            </div>
        </>
    );
};

export default Header;
