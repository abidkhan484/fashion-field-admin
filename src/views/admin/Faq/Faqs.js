import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

export default function Faqs() {
    const [loading, setLoading] = React.useState(false);
    const [question, setQuestion] = React.useState("");
    const [answer, setAnswer] = React.useState("");

    const [faqs, setFaqs] = React.useState([]);

    const [errorStatus, setErrorStatus] = useState(null);

    const { token, user } = useSelector((state) => state.auth);

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

    const handleFaqSubmit = () => {
        setLoading(true);
        axios
            .post(
                `faqs`,
                {
                    question: question,
                    answer: answer,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                setQuestion("");
                setAnswer("");
                setLoading(false);
                fetchFaqs();
                setErrorStatus(null);
            })
            .catch((error) => {
                console.log(error.response);
                setLoading(false);
                setErrorStatus(error.response.data.errors);
            });
    };

    const fetchFaqs = () => {
        axios
            .get(`faqs`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                setFaqs(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const deleteFaq = (id) => {
        axios
            .delete(`faqs/${id}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);
                fetchFaqs();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (token != "") {
            fetchFaqs();
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">FAQ's</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Manage FAQ's</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <div className="grid grid-cols-12">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="name"
                                className="createFromInputLabel"
                            >
                                Question
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="name"
                                className="createFromInputField"
                                placeholder="Question"
                                name="name"
                                onChange={(e) => setQuestion(e.target.value)}
                                value={question}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.question}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-12 mt-2">
                        <div className="col-span-4 flex items-center">
                            <label
                                htmlFor="name"
                                className="createFromInputLabel"
                            >
                                Answer
                            </label>
                        </div>
                        <div className="col-span-8">
                            <input
                                type="text"
                                id="name"
                                className="createFromInputField"
                                placeholder="Answer"
                                name="name"
                                onChange={(e) => setAnswer(e.target.value)}
                                value={answer}
                            />
                            <p className="font-Poppins font-medium text-xs text-red-500">
                                {errorStatus?.answer}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-8 mt-8 flex justify-end">
                {loading ? (
                    <>
                        <button className="button button-primary w-32" disabled>
                            {" "}
                            <span className="fas fa-sync-alt animate-spin"></span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => handleFaqSubmit()}
                            className="button button-primary w-32"
                        >
                            Send
                        </button>
                    </>
                )}
            </div>

            <div className="card mt-12">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">FAQ's</h4>
                        </div>
                    </div>
                </div>
                <div className="card-body overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Question</th>
                                <th className="tableHeader">Answer</th>
                                <th className="tableHeader float-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {faqs?.map((item, index) => (
                                <tr className="border-b py-4 h-20">
                                    <td className="tableData">
                                        {item.question}
                                    </td>
                                    <td className="tableData">{item.answer}</td>
                                    <td className="tableData float-right mt-8">
                                        <button
                                            onClick={() => deleteFaq(item.id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            DEL
                                        </button>
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
