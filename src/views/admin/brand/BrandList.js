import React, { useState, useEffect } from "react";
import { LoaderContext } from "context/LoaderContext";
import { useSelector } from "react-redux";
import axios from "axios";
import CreateBrandModal from "./CreateBrandModal";
import Moment from "react-moment";
import "moment-timezone";
import Pagination from "core/Pagination";
import { useHistory } from "react-router-dom";

import UpdateBrandModal from "./UpdateBrandModal";
import { permission } from "helper/permission";

const BrandList = () => {
  const [open, setOpen] = useState(false);
  const { loading, setLoading } = React.useContext(LoaderContext);
  const { token, user } = useSelector((state) => state.auth);
  const [allBrands, setAllBrands] = useState([]);

  const [updateModal, setUpdateModal] = useState(false);
  const [brandId, setBrandId] = useState(null);

  let history = useHistory();

  React.useEffect(() => {
    if (user?.permissions) {
      if (
        !permission(user.permissions, "products_brands", "access") &&
        user.user_type_id != 1
      )
        history.push("/admin");
    }
  }, [user]);

  const updatePage = (url) => {
    setLoading(true);
    axios
      .get(url, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setAllBrands(response.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    // setLoading(true);

    if (updateModal == false) {
      if (token !== "") {
        setLoading(true);
        axios
          .get("/brands", {
            headers: { Authorization: token, Accept: "application/json" },
          })
          .then((response) => {
            console.log(response.data);
            setAllBrands(response.data);
            setLoading(false);
          })
          .catch((errors) => {
            console.log(errors.response);
            setLoading(false);
          });
      }
    }
  }, [token, open, updateModal]);

  return (
    <>
      <div className="mt-8 px-8 mb-8">
        <div className="page-heading">
          <h1 className="pageHeading">All Brands</h1>
          <div className="flex">
            {user?.permissions &&
            (permission(user.permissions, "products_brands", "create") ||
              user.user_type_id == 1) ? (
              <button
                className="button button-outline-primary px-4"
                onClick={() => setOpen((prevState) => !prevState)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Brand
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="card">
          <div className="border-b">
            <div className="card-header">
              <div>
                <h4 className="pageHeading">Brands</h4>
              </div>
              <input className="inputBox" placeholder="Search" />
            </div>
          </div>
          <div className="card-body overflow-x-auto">
            <table className="w-350 2xl:w-full table-fixed">
              <thead>
                <tr className="border-b h-12">
                  <th className="tableHeader w-1/5">Name</th>
                  <th className="tableHeader w-1/5">Slug</th>
                  <th className="tableHeader w-1/5">Thumbnail</th>
                  <th className="tableHeader w-1/5">Date</th>
                  <th className="tableHeader w-1/5">Status</th>
                  <th className="tableHeader w-1/5">Action</th>
                </tr>
              </thead>
              <tbody>
                {allBrands?.data?.map((item, index) => (
                  <tr key={index} className="border-b py-4 h-20">
                    <td className="tableData">{item.name}</td>
                    <td className="tableData">{item.slug}</td>
                    <td className="tableData">
                      {item.logo ? (
                        <>
                          <img
                            className="w-10 h-auto"
                            alt="Product"
                            src={item.logo}
                          />
                        </>
                      ) : (
                        <>
                          <span className="w-10 h-10 bg-gray-200 rounded-full"></span>
                        </>
                      )}
                    </td>
                    <td className="tableData">
                      <Moment format="MMM, D YYYY">{item.created_at}</Moment>
                    </td>

                    <td className="">
                      {/* {(item.active) ? 'Active' : 'Deactived'} */}
                      {item.active ? (
                        <span className="activeButtonView">Active</span>
                      ) : (
                        <span className="deActiveButtonView">Deactive</span>
                      )}
                    </td>
                    <td>
                      {user?.permissions &&
                      (permission(
                        user.permissions,
                        "products_brands",
                        "update"
                      ) ||
                        user.user_type_id == 1) ? (
                        <i
                          className="fas fa-pen cursor-pointer"
                          onClick={() => {
                            setUpdateModal((prevState) => !prevState);
                            setBrandId(item.id);
                          }}
                        ></i>
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
              <p className="font-Poppins font-normal text-sm">
                Showing{" "}
                <b>
                  {allBrands.from} - {allBrands.to}
                </b>{" "}
                from <b>{allBrands.total}</b> data
              </p>

              <div className="flex items-center">
                <Pagination sellers={allBrands} setUpdate={updatePage} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateBrandModal open={open} setOpen={setOpen} />
      <UpdateBrandModal
        updateModal={updateModal}
        setUpdateModal={setUpdateModal}
        brandId={brandId}
        setBrandId={setBrandId}
      />
    </>
  );
};

export default BrandList;

// onClick={() => { setUpdateModal(prevState => !prevState); setCategoryId(item.id) }}
