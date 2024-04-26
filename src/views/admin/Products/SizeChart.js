import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { Editor } from "@tinymce/tinymce-react";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";

export default function SizeChart() {
    const editorRef = React.useRef(null);
    const { token, user } = useSelector((state) => state.auth);

    const [categories, setCategories] = React.useState([]);
    const [subCategories, setSubCategories] = React.useState([]);
    const [productCategories, setProductCategories] = React.useState([]);
    const [selected, setSelected] = React.useState(null);
    const [chart, setChart] = React.useState("");
    const [content, setContent] = React.useState("");

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "products_size_chart",
                    "access"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    React.useEffect(() => {
        if (token != "") {
            axios
                .get("/categories", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    // console.log(response.data)
                    setCategories([]);
                    response.data?.map((item) => {
                        setCategories((prevState) => [
                            ...prevState,
                            { label: item.name, value: item.id },
                        ]);
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }, [token]);

    const fetchSubCategories = (option) => {
        axios
            .get(`/categories/${option.value}`, {
                headers: { Authorization: token, Accept: "application/json" },
            })
            .then((response) => {
                console.log(response.data);
                setSubCategories([]);

                response?.data?.sub_category.map((item) => {
                    setSubCategories((prevState) => [
                        ...prevState,
                        { label: item.name, value: item.id },
                    ]);
                });
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    const fetchProductCategories = (option) => {
        axios
            .get(`/categories/sub-categories/${option.value}`, {
                headers: { Authorization: token, Accept: "application/json" },
            })
            .then((response) => {
                console.log(response.data);
                setProductCategories([]);
                response.data?.product_category?.map((item) => {
                    setProductCategories((prevState) => [
                        ...prevState,
                        { label: item.name, value: item.id },
                    ]);
                });
            })
            .catch((errors) => {
                console.log(errors);
            });
    };

    const fetchCurrentChart = () => {
        if (selected != null) {
        }
    };

    const handleSubmit = () => {
        axios
            .post(
                `sizechart`,
                {
                    product_category_id: selected?.value,
                    chart: chart,
                    content: content,
                },
                {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                }
            )
            .then((response) => {
                // console.log(response.data);
                setSubCategories([]);
                setProductCategories([]);
                setSelected(null);
                setChart("");
                setContent("");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    React.useEffect(() => {
        if (selected != null) {
            axios
                .get(`sizechart/${selected.value}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response);
                    setChart(response.data.chart);
                    setContent(response.data.content);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }, [selected]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Size Chart</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Make Size Chart</h4>
                        </div>
                        {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                        {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                    </div>
                </div>
                <div
                    className="card-body overflow-x-auto"
                    style={{ minHeight: "600px" }}
                >
                    <div className="w-full flex -mx-1">
                        <div className="w-1/3 mx-1">
                            <label className="font-bold text-sm">
                                Select Category
                            </label>
                            <Select
                                options={categories}
                                onChange={(option) =>
                                    fetchSubCategories(option)
                                }
                            />
                        </div>
                        <div className="w-1/3 mx-1">
                            <label className="font-bold text-sm">
                                Select Sub Category
                            </label>
                            <Select
                                options={subCategories}
                                onChange={(option) =>
                                    fetchProductCategories(option)
                                }
                            />
                        </div>
                        <div className="w-1/3 mx-1">
                            <label className="font-bold text-sm">
                                Select Product Category
                            </label>
                            <Select
                                options={productCategories}
                                onChange={(option) => [
                                    setSelected(option),
                                    fetchCurrentChart(),
                                ]}
                            />
                        </div>
                    </div>
                    {selected != null ? (
                        <>
                            <div className="w-full flex -mx-1 mt-10">
                                <div className="w-1/2 mx-1">
                                    <label className="font-bold text-sm">
                                        Chart
                                    </label>
                                    <Editor
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        apiKey="jjoj3dymtyvp0tkx04ikh1xmrbs4bzpwzj37ov4o9r9qflxc"
                                        onChange={(evt, editor) =>
                                            setChart(evt.level.content)
                                        }
                                        initialValue={chart}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist autolink lists link image charmap print preview anchor",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime media table paste code help wordcount",
                                            ],
                                            toolbar: "table",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                </div>
                                <div className="w-1/2 mx-1">
                                    <label className="font-bold text-sm">
                                        Guide
                                    </label>
                                    <Editor
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        apiKey="jjoj3dymtyvp0tkx04ikh1xmrbs4bzpwzj37ov4o9r9qflxc"
                                        onChange={(evt, editor) =>
                                            setContent(evt.level.content)
                                        }
                                        initialValue={content}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist autolink lists link image charmap print preview anchor",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime media table paste code help wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | formatselect | " +
                                                "bold italic backcolor | alignleft aligncenter " +
                                                "alignright alignjustify | bullist numlist outdent indent | " +
                                                "removeformat | help |" +
                                                "table",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="w-full -mx-1">
                                <button
                                    onClick={handleSubmit}
                                    className="float-right bg-blue-600 text-white px-4 py-2 rounded mt-4 mx-1"
                                >
                                    SAVE
                                </button>
                            </div>
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
