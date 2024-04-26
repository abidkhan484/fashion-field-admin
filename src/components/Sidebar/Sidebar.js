/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";
import { activeNav } from "navhelper";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            ADMIN DASHBOARD
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    ADMIN DASHBOARD
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Management
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/dashboard") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/dashboard"
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/dashboard")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Dashboard
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/sellers") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/sellers"
                >
                  <i
                    className={
                      "fa fa-users mr-2 text-sm p-3 rounded-full " +
                      (window.location.href.indexOf("/admin/sellers") !== -1
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Sellers
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/suppliers") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/suppliers"
                >
                  <i
                    className={
                      "fas fa-user-friends mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/suppliers")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Suppliers
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/categories") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/categories"
                >
                  <i
                    className={
                      "fas fa-list-ul mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/categories")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Categories
                </Link>

                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/brands") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/brands"
                >
                  <i
                    className={
                      "far fa-building mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/brands")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Brands
                </Link>

                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/attributes") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/attributes"
                >
                  <i
                    className={
                      "fas fa-tasks mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/attributes")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Attributes
                </Link>

                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/products-adding") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/products-adding"
                >
                  <i
                    className={
                      "fas fa-plus-square mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/products-adding")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  Add Product
                </Link>

                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/all-products") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/all-products"
                >
                  <i
                    className={
                      "fas fa-plus-square mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/all-products")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  All Products
                </Link>
              </li>
              
              <li className="items-center">
                <Link
                  className={
                    `text-sm uppercase py-1 font-bold block hover:text-gray-700 ${activeNav("/admin/suppliers") ? "text-gray-800" : "text-gray-500"}`}
                  to="/admin/admin"
                >
                  <i
                    className={
                      "fas fa-user-cog mr-2 text-sm p-3 rounded-full " +
                      (activeNav("/admin/suppliers")
                        ? "text-white bg-buttonColor"
                        : "text-gray-500")
                    }
                  ></i>{" "}
                  System Users
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}