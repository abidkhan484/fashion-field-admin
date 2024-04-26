import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { permission } from "helper/permission";

const CategoryBannerCreateSlider = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [loading, setLoading] = React.useState(false);
    const [image, setImage] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [errors, setErrors] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [type, setType] = React.useState("");
    const [link, setLink] = React.useState("");

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(user.permissions, "banner_category", "create") &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const fetchBanner = () => {
        axios
            .get("/categoryBanner", {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const uploadSliderHandler = () => {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("category_id", category);
        formData.append("link", link);

        axios
            .post("categorySlider", formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((res) => {
                history.push("/admin/categoryBanner");
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
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Add New Sliders</h1>
                <div className="flex"></div>
            </div>
            <div className="card">
                <div className="border-b">
                    <div className="card-header">
                        <div>
                            <h4 className="pageHeading">Add Slider</h4>
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
                                onChange={(e) => setCategory(e.target.value)}
                                name="category_id"
                            >
                                <option className="disabled">Select</option>
                                {categories?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-red-600 text-sm">
                                {errors.category}
                            </p>
                        </div>
                        {/* <div className="w-1/3 mx-1">
                            <label htmlFor="contact" className="createFromInputLabel">Type</label>
                            <input type="text" onChange={(e) => setType(e.target.value)}  className="createFromInputField" name="type"/>
                            <p className="text-red-600 text-sm">{errors.contact}</p>
                        </div> */}
                        <div className="w-1/3 mx-1">
                            <label
                                htmlFor="charge"
                                className="createFromInputLabel"
                            >
                                Image
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                className="createFromInputField"
                                name="image"
                            />
                            <p className="text-sm">Image size: 1920x430</p>
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
                        <button className="button button-primary w-32" disabled>
                            {" "}
                            <span className="fas fa-sync-alt animate-spin"></span>
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={uploadSliderHandler}
                            className="button button-primary w-32"
                        >
                            Create Slider
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CategoryBannerCreateSlider;
