import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { permission } from "helper/permission";
const SubCategoryBannerCreateBanner = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [subcategory, setSubCategory] = React.useState("");
    const [errors, setErrors] = React.useState([]);
    const [subcategories, setSubCategories] = React.useState([]);
    const [type, setType] = React.useState("");
    const [link, setLink] = React.useState("");
    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "banner_sub_category",
                    "create"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);
    const fetchBanner = () => {
        axios
            .get("/subCategoryBanner", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setSubCategories(response.data.subcategories);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const uploadBannerHandler = () => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("subcategory_id", subcategory);
        formData.append("type", type);
        formData.append("link", link);

        axios
            .post("subCategoryBanner", formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                history.push("/admin/subcategoryBanner");
                setImage("");
                fetchBanner();
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    useEffect(() => {
        fetchBanner();
    }, []);

    return (
        <div>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Add New Banner</h1>
                    <div className="flex"></div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Add Banner</h4>
                            </div>
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <div className="w-full flex -mx-1">
                            <div className="w-1/3 mx-1">
                                <label
                                    htmlFor="category_id"
                                    className="createFromInputLabel"
                                >
                                    Category
                                </label>

                                <select
                                    className="createFromInputField"
                                    onChange={(e) =>
                                        setSubCategory(e.target.value)
                                    }
                                    name="category_id"
                                >
                                    <option className="disabled">Select</option>
                                    {subcategories?.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-red-600 text-sm">
                                    {errors.category}
                                </p>
                            </div>
                            <div className="w-1/3 mx-1">
                                <label
                                    htmlFor="contact"
                                    className="createFromInputLabel"
                                >
                                    Type
                                </label>
                                {/* <input type="text" onChange={(e) => setType(e.target.value)}  className="createFromInputField" /> */}
                                <select
                                    className="createFromInputField"
                                    onChange={(e) => setType(e.target.value)}
                                    name="type"
                                >
                                    <option className="disabled">Select</option>
                                    <option className="" value="headerbanner">
                                        HeaderBanner - Size: 770x565
                                    </option>
                                    <option className="" value="section1small">
                                        Section1(Small) - Size: 370x268
                                    </option>
                                    <option className="" value="section1large">
                                        Section1(Large) - Size: 370x268
                                    </option>
                                    <option className="" value="section2small">
                                        Section2(Small) - Size: 270x330
                                    </option>
                                    <option className="" value="section2large">
                                        Section2(Large) - Size: 570x330
                                    </option>
                                </select>
                                <p className="text-red-600 text-sm">
                                    {errors.type}
                                </p>
                            </div>
                            <div className="w-1/3 mx-1">
                                <label
                                    htmlFor="charge"
                                    className="createFromInputLabel"
                                >
                                    Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                    className="createFromInputField"
                                    name="image"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.image}
                                </p>
                            </div>

                            <div className="w-1/3 mx-1">
                                <label
                                    htmlFor="link"
                                    className="createFromInputLabel"
                                >
                                    Link
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) => setLink(e.target.value)}
                                    className="createFromInputField"
                                    name="link"
                                />
                                <p className="text-red-600 text-sm">
                                    {errors.link}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-8 mt-8 flex justify-end">
                    {loading ? (
                        <>
                            <button
                                className="button button-primary w-32"
                                disabled
                            >
                                {" "}
                                <span className="fas fa-sync-alt animate-spin"></span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={uploadBannerHandler}
                                className="button button-primary w-32"
                            >
                                Create Banner
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryBannerCreateBanner;
