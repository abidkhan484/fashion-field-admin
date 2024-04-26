import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

import { useSelector } from "react-redux";
import axios from "axios";
import Select from "react-select";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Alert from "core/Alert";
import { useHistory } from "react-router-dom";
import { permission } from "helper/permission";
// import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
// import Context from '@ckeditor/ckeditor5-core/src/context';

const editorModules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
    ],
};

const editorFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
];

const NewProductAdding = () => {
    const editorRef = React.useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const { token, user } = useSelector((state) => state.auth);

    let history = useHistory();

    React.useEffect(() => {
        if (user?.permissions) {
            if (
                !permission(
                    user.permissions,
                    "products_manage_product",
                    "create"
                ) &&
                user.user_type_id != 1
            )
                history.push("/admin");
        }
    }, [user]);

    const [toolbarSettings, setToolbarSettings] = useState();

    const [name, setName] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [specialPrice, setSpecialPrice] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [productImagesPreview, setProductImagesPreview] = useState([]);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryOptions, setCategroyOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [subCategory, setSubCategory] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const [productCategory, setProductCategory] = useState([]);
    const [productCategoryOptions, setProductCategoryOptions] = useState([]);
    const [selectedProductCategory, setSelectedProductCategory] =
        useState(null);

    const [shopNames, setShopNames] = useState([]);
    const [shopOptions, setShopOptions] = useState([]);
    const [selectedShopName, setSelectedShopName] = useState(null);
    const [vendorType, setVendorType] = useState(null);
    const [shopId, setShopId] = useState("");
    const [isVariableProduct, setIsVariableProduct] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [supplierStock, setSupplierStock] = useState("");
    const [productStatus, setProductStatus] = useState(null);
    const [errorStatus, setErrorStatus] = useState(null);
    const [status, setStatus] = useState({});
    const [brands, setBrands] = useState([]);
    const [productBrnad, setProductBrand] = useState("");
    const [specification, setSpecification] = useState("");
    const [style_no, setStyleNo] = useState("");

    const statusOptions = [
        {
            value: "draft",
            label: "Unpublish",
        },
        {
            value: "publish",
            label: "Publish",
        },
    ];

    useEffect(() => {
        // console.log(selectedShopName)
        // console.log(vendorType)
        // console.log(shopId)
        // console.log(description)
        // console.log(productStatus)
        // console.log(thumbnail)
        // console.log(productImages)
        // console.log(allTags)
        // console.log(categories)
    }, [
        selectedShopName,
        vendorType,
        shopId,
        allTags,
        productImages,
        description,
        productStatus,
        thumbnail,
        productImages,
        allTags,
        categories,
    ]);

    const handleAddingNewProduct = () => {
        setLoading(true);
        // if (selectedProductCategory == null || productStatus == null) {
        // setStatus({
        //     type: 'DANGER',
        //     message: "You havn't selected the Product Category or Status",
        // })
        //     setLoading(false)
        //     return
        // }
        setStatus({});
        const data = new FormData();
        data.append("name", name);
        data.append("short_description", shortDescription);
        data.append("description", description);
        data.append("price", price);
        data.append("cost_price", costPrice);
        data.append(
            "category_id",
            selectedProductCategory?.value ? selectedProductCategory.value : ""
        );
        data.append("store_id", shopId);
        data.append("status", productStatus?.value ? productStatus.value : "");
        data.append("special_price", specialPrice);
        data.append("thumbnail", thumbnail);
        data.append("style_no", style_no);
        data.append("brand_id", productBrnad?.value ? productBrnad?.value : "");

        // Modified the requirement for manage_stock for everyone.
        data.append("manage_stock", 1);

        if (isVariableProduct == false)
            data.append("stock", supplierStock >= 0 ? supplierStock : "");
        else data.append("stock", 0);

        // data.append("images[]", productImages)
        productImages.map((item) => {
            data.append("images[]", item);
        });
        allTags.map((item) => {
            data.append("tags[]", item);
        });

        // vendorType == 2 ? data.append("manage_stock", 1) : data.append("manage_stock", 0)
        // vendorType == 2 ? data.append("stock", supplierStock) : data.append("stock", "")
        data.append("is_variable", isVariableProduct ? 1 : 0);

        data.append("specification", specification);

        // console.log(data)

        axios
            .post("/products", data, {
                headers: {
                    Accept: "application/json",
                    Authorization: token,
                },
            })
            .then((response) => {
                console.log(response);

                if (response.data.is_variable) {
                    history.push(
                        `/admin/products-adding/${response.data.id}/options`
                    );
                }

                setStatus({
                    type: "SUCCESS",
                    message: response.data.message,
                });

                setErrorStatus(null);
                setName("");
                setShortDescription("");
                setDescription("");
                setPrice("");
                setSpecialPrice("");
                setCostPrice("");
                setSelectedCategory(null);
                setSelectedSubCategory(null);
                setSelectedProductCategory(null);
                setThumbnail("");
                setThumbnailPreview(null);
                setProductImages([]);
                setProductImagesPreview([]);
                setSelectedShopName(null);
                setVendorType(null);
                setShopId("");
                setAllTags([]);
                setSupplierStock("");
                setProductStatus(null);
                setProductBrand("");
                setSpecification("");
                setStyleNo("");

                setLoading(false);
            })
            .catch((errors) => {
                console.log(errors.response?.data?.errors);
                setErrorStatus(errors.response?.data?.errors);
                console.log(errors.response);
                setStatus({
                    type: "DANGER",
                    message: "You havn't fill up all the fields",
                });

                setLoading(false);
            });
    };

    const handleAddingThumbnail = (e) => {
        const [file] = e.target.files;

        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setThumbnail("");
        setThumbnailPreview("");
    };

    const handleAddingProductImages = (e) => {
        const [file] = e.target.files;

        if (file) {
            const data = new FormData();
            data.append("image", file);

            axios
                .post("/product/images", data, {
                    headers: {
                        Accept: "application/json",
                        Authorization: token,
                    },
                })
                .then((response) => {
                    console.log(response);
                    setProductImages((prevState) => [
                        ...prevState,
                        response.data.id,
                    ]);
                    setProductImagesPreview((prevState) => [
                        ...prevState,
                        response.data.main_image.image,
                    ]);
                })
                .catch((errors) => {
                    console.log(errors);
                });
            // setProductImages(prevState => [...prevState, file])
            // setProductImagesPreview(prevState => [...prevState, URL.createObjectURL(file)])
        }
    };

    const removeImage = (index) => {
        const imageTemp = [...productImages];
        imageTemp.splice(index, 1);
        setProductImages(imageTemp);

        const imagePreviewTemp = [...productImagesPreview];
        imagePreviewTemp.splice(index, 1);
        setProductImagesPreview(imagePreviewTemp);
    };

    // GETTING SHOP NAMES
    useEffect(() => {
        if (token != "") {
            axios
                .get("/stores", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    // console.log(response.data)
                    setShopNames(response.data);
                })
                .catch((errors) => {
                    console.log(errors);
                });

            axios
                .get("/brands/all", {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    let data = response.data;
                    setBrands([]);
                    data.map((item, index) => {
                        setBrands((prevState) => [
                            ...prevState,
                            { value: item.id, label: item.name },
                        ]);
                    });
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [token]);

    useEffect(() => {
        if (shopNames.length > 1) {
            shopNames.map((item, index) => {
                setShopOptions((prevState) => [
                    ...prevState,
                    {
                        id: item.vendor.vendor_type_id,
                        label: item.name,
                        value: item.id,
                    },
                ]);
            });
        }
    }, [shopNames]);

    useEffect(() => {
        if (selectedShopName) {
            // console.log(selectedShopName)
            setVendorType(selectedShopName.id);
            setShopId(selectedShopName.value);
        }
    }, [selectedShopName]);

    // GETTING THE CATEGORIES
    useEffect(() => {
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
                    setCategories(response.data);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [token]);

    useEffect(() => {
        if (categories.length > 0) {
            categories.map((item, index) => {
                setCategroyOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
                // console.log(categoryOptions)
            });
        }
    }, [categories]);

    // GETTING THE SUB-CATEGORIES
    useEffect(() => {
        if (selectedCategory) {
            axios
                .get(`/categories/${selectedCategory.value}`, {
                    headers: {
                        Authorization: token,
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    console.log(response.data.sub_category);
                    setSubCategory(response.data.sub_category);
                    setSubCategoryOptions([]);
                    setProductCategoryOptions([]);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (subCategory.length > 0) {
            subCategory.map((item, index) => {
                setSubCategoryOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [subCategory]);

    // GETTING THE Product-CATEGORIES
    useEffect(() => {
        if (selectedSubCategory) {
            axios
                .get(
                    `/categories/sub-categories/${selectedSubCategory.value}`,
                    {
                        headers: {
                            Authorization: token,
                            Accept: "application/json",
                        },
                    }
                )
                .then((response) => {
                    console.log(response.data);
                    setProductCategory(response.data.product_category);
                    setProductCategoryOptions([]);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        }
    }, [selectedSubCategory]);

    useEffect(() => {
        if (productCategory.length > 0) {
            productCategory.map((item, index) => {
                setProductCategoryOptions((prevState) => [
                    ...prevState,
                    { value: item.id, label: item.name },
                ]);
            });
        }
    }, [productCategory]);

    return (
        <div className="mb-8">
            <p className="px-8 mt-8 mb-4 font-Poppins font-medium text-base text-pageHeading">
                Add a New Product
            </p>
            <Alert
                status={status?.type}
                type={status?.type}
                changeStatus={() => setStatus()}
                message={status?.message}
                width="w-1/2"
                margin="ml-8"
            />
            <div className="grid grid-cols-12 px-8 gap-8">
                <div className="col-span-8">
                    <div className="bg-white w-full shadow-md rounded-md">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Information
                        </p>
                        <div className="pl-8 pr-20 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="name"
                                        className="createFromInputLabel"
                                    >
                                        Name
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="text"
                                        id="name"
                                        className="createFromInputField"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="shortDescription"
                                        className="createFromInputLabel"
                                    >
                                        Short Description
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    {/* <textarea id="shortDescription" className="createFromInputField" rows="2" placeholder="Short Description" value={shortDescription} onChange={e => setShortDescription(e.target.value)} /> */}
                                    <Editor
                                        apiKey="jjoj3dymtyvp0tkx04ikh1xmrbs4bzpwzj37ov4o9r9qflxc"
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        onChange={(evt, editor) =>
                                            setShortDescription(
                                                evt.level.content
                                            )
                                        }
                                        initialValue=""
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist autolink lists link image charmap print preview anchor",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime media table paste code help wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | table",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.short_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="description"
                                        className="createFromInputLabel"
                                    >
                                        Description
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    {/* <textarea id="description" className="createFromInputField" rows="5" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /> */}
                                    {/* <ReactQuill
                                        theme="snow"
                                        value={description}
                                        onChange={value => setDescription(value)}
                                        modules={editorModules}
                                        formats={editorFormats}
                                        placeholder="Description"
                                    /> */}
                                    <Editor
                                        apiKey="jjoj3dymtyvp0tkx04ikh1xmrbs4bzpwzj37ov4o9r9qflxc"
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        onChange={(evt, editor) =>
                                            setDescription(evt.level.content)
                                        }
                                        initialValue=""
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                "advlist autolink lists link image charmap print preview anchor",
                                                "searchreplace visualblocks code fullscreen",
                                                "insertdatetime media table paste code help wordcount",
                                            ],
                                            toolbar:
                                                "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | table",
                                            content_style:
                                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                        }}
                                    />
                                    {/* <CKEditorContext context={Context}>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data="<p>Hello from CKEditor 5!</p>"
                                            onReady={editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                console.log({ event, editor, data });
                                            }}
                                            config={{ plugins: [Base64UploadAdapter] }}
                                        // onBlur={(event, editor) => {
                                        //     console.log('Blur.', editor);
                                        // }}
                                        // onFocus={(event, editor) => {
                                        //     console.log('Focus.', editor);
                                        // }}
                                        />
                                    </CKEditorContext> */}
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {categoryOptions && (
                                <div className="grid grid-cols-12 mt-4">
                                    <div className="col-span-4 flex items-center">
                                        <p className="createFromInputLabel">
                                            Category
                                        </p>
                                    </div>
                                    <div className="col-span-8">
                                        <Select
                                            value={selectedCategory}
                                            onChange={(option) => {
                                                setSelectedCategory(option);
                                                setSubCategoryOptions([]);
                                                setProductCategoryOptions([]);
                                                setSelectedSubCategory(null);
                                                setSelectedProductCategory(
                                                    null
                                                );
                                            }}
                                            options={categoryOptions}
                                            className="w-full createFromInputLabel selectTag"
                                            placeholder="Select Category"
                                            isClearable={true}
                                            isSearchable={true}
                                            id="category"
                                        />
                                        {/* {errorStatus && <p className="text-red-500 font-Poppins font-medium text-xs">{errorStatus.category_id}</p>} */}
                                    </div>
                                </div>
                            )}

                            {selectedCategory && (
                                <div className="grid grid-cols-12 mt-4">
                                    <div className="col-span-4 flex items-center">
                                        <p className="createFromInputLabel">
                                            Sub-Category
                                        </p>
                                    </div>
                                    <div className="col-span-8">
                                        <Select
                                            value={selectedSubCategory}
                                            onChange={(option) => {
                                                setSelectedSubCategory(option);
                                                setSelectedProductCategory(
                                                    null
                                                );
                                            }}
                                            options={subCategoryOptions}
                                            className="w-full createFromInputLabel selectTag"
                                            placeholder="Select Sub-Category"
                                            isClearable={true}
                                            isSearchable={true}
                                        />

                                        {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                    </div>
                                </div>
                            )}

                            {selectedCategory && selectedSubCategory && (
                                <div className="grid grid-cols-12 mt-4">
                                    <div className="col-span-4 flex items-center">
                                        <p className="createFromInputLabel">
                                            Product-Category
                                        </p>
                                    </div>
                                    <div className="col-span-8">
                                        <Select
                                            value={selectedProductCategory}
                                            onChange={(option) =>
                                                setSelectedProductCategory(
                                                    option
                                                )
                                            }
                                            options={productCategoryOptions}
                                            className="w-full createFromInputLabel selectTag"
                                            placeholder="Select Product-Category"
                                            isClearable={true}
                                            isSearchable={true}
                                        />
                                        {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="price"
                                        className="createFromInputLabel"
                                    >
                                        Price
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        id="price"
                                        className="createFromInputField"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        min={1}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="costPrice"
                                        className="createFromInputLabel"
                                    >
                                        Cost Price
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        id="costPrice"
                                        className="createFromInputField"
                                        placeholder="Cost Price"
                                        value={costPrice}
                                        onChange={(e) =>
                                            setCostPrice(e.target.value)
                                        }
                                        min={1}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.cost_price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="specialPrice"
                                        className="createFromInputLabel"
                                    >
                                        Special Price
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="number"
                                        id="specialPrice"
                                        className="createFromInputField"
                                        placeholder="Special Price"
                                        value={specialPrice}
                                        onChange={(e) =>
                                            setSpecialPrice(e.target.value)
                                        }
                                        min={1}
                                    />
                                    {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Image
                        </p>
                        <div className="pl-8 pr-20 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Thumbnail image
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <div>
                                        <label
                                            htmlFor="thumbnail"
                                            className="w-full h-10 flex items-center border-1 rounded-tl rounded-bl"
                                        >
                                            <div className="px-6 h-full bg-browseBG createFromInputLabel flex items-center">
                                                Browse
                                            </div>
                                            {thumbnailPreview && (
                                                <p className="createFromInputLabel ml-10">
                                                    Image Selected
                                                </p>
                                            )}
                                        </label>
                                        <input
                                            id="thumbnail"
                                            onChange={(e) =>
                                                handleAddingThumbnail(e)
                                            }
                                            type="file"
                                            className="hidden"
                                        />
                                        <p className="text-sm">
                                            Image size: 1200x1480
                                        </p>
                                    </div>
                                    {thumbnailPreview && (
                                        <div className="w-full mt-4">
                                            <div className="relative w-28 h-28 border-1 p-2">
                                                <button
                                                    onClick={removeThumbnail}
                                                    className="bg-red-600 text-white p-1 rounded-full absolute -right-3 -top-3 focus:outline-none"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                                <img
                                                    className="w-full h-full"
                                                    src={thumbnailPreview}
                                                    alt="..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.thumbnail}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-12 mt-4">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Gallary image
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <div>
                                        <label
                                            htmlFor="productImage"
                                            className="w-full h-10 flex items-center border-1 rounded-tl rounded-bl"
                                        >
                                            <div className="px-6 h-full bg-browseBG createFromInputLabel flex items-center">
                                                Browse
                                            </div>
                                            {productImagesPreview.length >
                                                0 && (
                                                <p className="createFromInputLabel ml-10">
                                                    {
                                                        productImagesPreview.length
                                                    }{" "}
                                                    image Selected
                                                </p>
                                            )}
                                        </label>
                                        <input
                                            id="productImage"
                                            onChange={(e) =>
                                                handleAddingProductImages(e)
                                            }
                                            type="file"
                                            className="hidden"
                                        />
                                        <p className="text-sm">
                                            Image size: 1200x1480
                                        </p>
                                    </div>
                                    <div className="w-full flex flex-wrap">
                                        {productImagesPreview.map(
                                            (item, index) => (
                                                <div
                                                    className="relative w-28 h-28 border-1 p-2 mt-4 mr-6"
                                                    key={index}
                                                >
                                                    <button
                                                        onClick={(e) =>
                                                            removeImage(index)
                                                        }
                                                        className="bg-red-600 text-white p-1 rounded-full absolute -right-3 -top-3 focus:outline-none"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <img
                                                        className="w-full h-full"
                                                        src={item}
                                                        alt="..."
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mt-8">
                        <div className="border-b">
                            <div className="card-header">
                                <div>
                                    <h4 className="pageHeading">
                                        Product Specification
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body overflow-auto">
                            <Editor
                                apiKey="jjoj3dymtyvp0tkx04ikh1xmrbs4bzpwzj37ov4o9r9qflxc"
                                onInit={(evt, editor) =>
                                    (editorRef.current = editor)
                                }
                                onChange={(evt, editor) =>
                                    setSpecification(evt.level.content)
                                }
                                initialValue=""
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        "advlist autolink lists link image charmap print preview anchor",
                                        "searchreplace visualblocks code fullscreen",
                                        "insertdatetime media table paste code help wordcount",
                                    ],
                                    toolbar:
                                        "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment | table",
                                    content_style:
                                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                }}
                            />
                            {errorStatus && (
                                <p className="text-red-500 font-Poppins font-medium text-xs">
                                    {errorStatus.specification}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-4">
                    <div className="bg-white w-full shadow-md rounded-md mb-4">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Styels
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Add Style Number
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        className="createFromInputField"
                                        type="text"
                                        value={style_no}
                                        onChange={(e) =>
                                            setStyleNo(e.target.value)
                                        }
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.style_no}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Store Information
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Select Store
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <Select
                                        value={selectedShopName}
                                        onChange={(option) => {
                                            setSelectedShopName(option);
                                            setVendorType(null);
                                            setShopId(null);
                                        }}
                                        options={shopOptions}
                                        className="w-full createFromInputLabel selectTag"
                                        placeholder="Select Store"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus.store_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Variation
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <label
                                        htmlFor="varient"
                                        className="createFromInputLabel"
                                    >
                                        Is Varrient Product
                                    </label>
                                </div>
                                <div className="col-span-8">
                                    <input
                                        type="checkbox"
                                        id="varient"
                                        onChange={() =>
                                            setIsVariableProduct(
                                                !isVariableProduct
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isVariableProduct ? (
                        <div className="bg-white w-full shadow-md rounded-md mt-8">
                            <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                                Managing Stock
                            </p>
                            <div className="px-8 pt-8 pb-8">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-4 flex items-center">
                                        <label
                                            htmlFor="supplierStock"
                                            className="createFromInputLabel"
                                        >
                                            Stock Quantity
                                        </label>
                                    </div>
                                    <div className="col-span-8">
                                        <input
                                            type="number"
                                            id="supplierStock"
                                            className="createFromInputField"
                                            placeholder="Stock Quantity"
                                            value={supplierStock}
                                            onChange={(e) =>
                                                setSupplierStock(e.target.value)
                                            }
                                            min={1}
                                        />
                                        {errorStatus && (
                                            <p className="text-red-500 font-Poppins font-medium text-xs">
                                                {errorStatus.stock}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Tags
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Give Tags
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <TagsInput
                                        value={allTags}
                                        onChange={(e) => setAllTags(e)}
                                        inputProps={{
                                            placeholder: "Type & Hit Enter",
                                        }}
                                        onlyUnique={true}
                                    />
                                    {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Select Brand
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Brands
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <Select
                                        value={productBrnad}
                                        onChange={(option) => {
                                            setProductBrand(option);
                                        }}
                                        options={brands}
                                        className="w-full createFromInputLabel selectTag"
                                        placeholder="Select Store"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                    {/* <p className="text-red-500 font-Poppins font-medium text-xs">{errors.name}</p> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white w-full shadow-md rounded-md mt-8">
                        <p className="py-4 border-b pl-8 font-Poppins font-medium text-base text-pageHeading">
                            Product Status
                        </p>
                        <div className="px-8 pt-8 pb-8">
                            <div className="grid grid-cols-12">
                                <div className="col-span-4 flex items-center">
                                    <p className="createFromInputLabel">
                                        Status
                                    </p>
                                </div>
                                <div className="col-span-8">
                                    <Select
                                        value={productStatus}
                                        onChange={(option) => {
                                            setProductStatus(option);
                                        }}
                                        options={statusOptions}
                                        className="w-full createFromInputLabel selectTag"
                                        placeholder="Select Status"
                                        isClearable={true}
                                        isSearchable={true}
                                    />
                                    {errorStatus && (
                                        <p className="text-red-500 font-Poppins font-medium text-xs">
                                            {errorStatus?.status}
                                        </p>
                                    )}
                                </div>
                            </div>
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
                            onClick={handleAddingNewProduct}
                            className="button button-primary w-32"
                        >
                            Add Product
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewProductAdding;
