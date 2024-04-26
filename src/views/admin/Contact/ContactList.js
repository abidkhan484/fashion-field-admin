import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ContactList = () => {
  const { token } = useSelector((state) => state.auth);

  const [contacts, setContacts] = React.useState([]);

  const fetchContacts = () => {
    axios
      .get("/contacts", {
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("💥", response.data);
        setContacts(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  
  React.useEffect(() => {
    if (token != "") {
        fetchContacts();
    }
  }, [token]);
  return (
    <div className="px-8 mt-8 mb-8">
      <div className="page-heading">
        <h1 className="pageHeading">Contacts</h1>
        <div className="flex"></div>
      </div>

      <div className="w-full">
        <div className="card">
          <div className="border-b">
            <div className="card-header">
              <div>
                <h4 className="pageHeading">Contact List</h4>
              </div>
            </div>
          </div>
          <div className="card-body overflow-x-auto">
            <div className="w-full overflow-x-scroll">
              <table className="w-full">
                <thead>
                  <tr className="border-b h-12">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone </th>
                    <th>Subject</th>
                    <th>Actions</th>
                  
                  </tr>
                </thead>
                <tbody>
                  {contacts?.map((item, index) => (
                    <tr key={index} className="h-12 border-b">
                      <td>
                        <p className="">{item.id}</p>
                      </td>
                      <td>
                        <p className="">{item.name}</p>
                      </td>
                      <td>
                        <p className="">{item.email}</p>
                      </td>
                      <td>
                        <p className="">{item.phone}</p>
                      </td>
                      <td>
                        <p className="">{item.subject}</p>
                      </td>
                      <td>
                        <Link
                          to={`/admin/contact/${item.id}`}
                          className="text-sm bg-green-600 text-white mx-2 px-2 py-1 rounded"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer">
            {/* <div className="flex flex-col justify-between md:flex-row items-center w-full">
                    {reviews && <p className="font-Poppins font-normal text-sm">Showing <b>{reviews.from}-{reviews.to}</b> from <b>{reviews.total}</b> data</p>}
                   

                    <div className="flex items-center">
                        {reviews && <Pagination sellers={reviews} setUpdate={updatePage} />}
                    </div>
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
