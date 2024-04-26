import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";

// views

import Dashboard from "views/admin/Dashboard.js";
// import Maps from "../views/admin/Maps.js";
import Settings from "../views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import Sellers from "../views/admin/sellers/Sellers.js";

import CreateSeller from "views/admin/sellers/CreateSeller.js";
import Loader from "core/Loader.js";
import { LoaderContext } from "context/LoaderContext.js";

import { StyleProvider } from "context/StyleContext.js";
import EditSeller from "views/admin/sellers/EditSeller.js";

import { useDispatch, useSelector } from "react-redux";
import { setAuth, getToken, setUser } from "redux/auth.js";
import axios from "axios";
import Suppliers from "views/admin/supplier/Suppliers.js";
import Category from "views/admin/category/Category.js";
import SubCategory from "views/admin/category/SubCategory.js";
import ProductCategory from "views/admin/category/ProductCategory.js";

import CreateSupplier from "views/admin/supplier/CreateSupplier.js";
import EditSupplier from "views/admin/supplier/EditSupplier.js";
import BrandList from "views/admin/brand/BrandList.js";
import AttributeList from "views/admin/Attribute/AttributeList.js";
import AttributeValueAddPage from "views/admin/Attribute/AttributeValueAddPage.js";

import Header from "pageLayout/Header.js";
import IndividualPageHeader from "refactoredView/IndividualPageHeader.js";
import NewProductAdding from "views/admin/Products/NewProductAdding.js";
import ProductList from "views/admin/Products/ProductList.js";
import Users from "views/admin/users/Users.js";
import AllOrder from "views/admin/orders/AllOrder.js";
import AddUser from "views/admin/users/AddUser.js";
import EditUser from "views/admin/users/EditUser.js";
import UpdateOrder from "views/admin/orders/UpdateOrder.js";
import Customers from "views/admin/customers/Customers.js";
import ShippingClass from "views/admin/shipping/ShippingClass.js";
import AddCities from "views/admin/shipping/AddCities.js";
import ProductAttribute from "views/admin/Products/ProductAttribute.js";
import EditProduct from "views/admin/Products/EditProduct.js";
import MenuList from "views/admin/Menus/MenuList.js";
import MenuItems from "views/admin/Menus/MenuItems.js";
import AddItem from "views/admin/Menus/AddItem.js";
import NavigationMenu from "views/admin/Menus/NavigationMenu.js";
import AddNavigationMenu from "views/admin/Menus/AddNavigationMenu.js";
import EditNavigationMenu from "views/admin/Menus/EditNavigationMenu.js";
import AddNavigationItem from "views/admin/Menus/AddNavigationItem.js";
import HomePageCategories from "views/admin/homepage/HomePageCategories.js";
import ProductReviews from "views/admin/reviews/ProductReviews.js";
import Couriers from "views/admin/Courier/Couriers";
import AddCourier from "views/admin/Courier/AddCourier.js";
import EditCourier from "views/admin/Courier/EditCourier.js";

import AddingCupon from "views/admin/Cupons/AddingCupon.js";
import AllCupons from "views/admin/Cupons/AllCupons.js";
import EditingCupon from "views/admin/Cupons/EditingCupon.js";

import Deals from "views/admin/Deals/Deals.js";
import HomePageBannerSlider from "views/admin/Banner/HomePageBannerSlider.js";
import CategoryBannerSlider from "views/admin/Banner/CategoryBannerSlider.js";
import CategoryBannerCreateSlider from "views/admin/Banner/CategoryBannerCreateSlider.js";
import CategoryBannerCreateBanner from "views/admin/Banner/CategoryBannerCreateBanner.js";
import SubCategoryBannerSlider from "views/admin/Banner/SubCategoryBannerSlider.js";
import SubCategoryBannerCreateSlider from "views/admin/Banner/SubCategoryBannerCreateSlider.js";
import SubCategoryBannerCreateBanner from "views/admin/Banner/SubCategoryBannerCreateBanner.js";
import OfferComponent from "views/admin/offers/OfferComponent.js";
import UserPermission from "views/admin/users/UserPermission.js";
import PayoutHistoryPending from "views/admin/Payout/PayoutHistoryPending";
import PayoutHistoryEdit from "views/admin/Payout/PayoutHistoryEdit.js";
import PayoutHistory from "views/admin/Payout/PayoutHistory.js";
import PayoutPaidHistoryEdit from "views/admin/Payout/PayoutPaidHistoryEdit.js";
import PageList from "views/admin/Page/PageList.js";
import EditPage from "views/admin/Page/EditPage.js";
import CreatePage from "views/admin/Page/CreatePage.js";
import Newsletters from "views/admin/Newsletter/Newsletters.js";
import SendNewsletter from "views/admin/Newsletter/SendNewsletter.js";
import Faqs from "views/admin/Faq/Faqs.js";
import Testimonials from "views/admin/testimonial/Testimonials.js";
import ContactList from "views/admin/Contact/ContactList.js";
import ContactDetails from "views/admin/Contact/ContactDetails.js";
import NewMenuList from "views/admin/NewMenu/NewMenuList.js";
import NewMenuAdd from "views/admin/NewMenu/NewMenuAdd.js";
import NewMenuEdit from "views/admin/NewMenu/NewMenuEdit.js";
import SocialMenuList from "views/admin/SocialMenu/SocialMenuList.js";
import AddSocialMenu from "views/admin/SocialMenu/AddSocialMenu.js";
import EditSocialMenu from "views/admin/SocialMenu/EditSocialMenu.js";
import InvoicePrint from "views/admin/orders/InvoicePrint.js";
import SizeChart from "views/admin/Products/SizeChart.js";
import ShowNavigationMenu from "views/admin/Menus/ShowNavigationMenu.js";
import BestSeller from "views/admin/BestSeller/BestSeller.js";

import SellerRequestList from "views/admin/sellers/SellerRequestList.js";
import SellerSettings from "views/admin/sellers/SellerSettings.js";
import AddSettingsRequirments from "views/admin/sellers/AddSettingsRequirments.js";
import SellerVerification from "views/admin/sellers/SellerVerification.js";

import PointOfSaleSystem from "views/admin/orders/PointOfSaleSystem.js";
import OrderReport from "views/admin/Reports/OrderReport.js";
import LogisticRequisitionReport from "views/admin/Reports/LogisticRequisitionReport.js";
import SalesReports from "views/admin/Reports/SalesReports.js";
import PaymentMethodReport from "views/admin/Reports/PaymentMethodReport.js";
import VendorReport from "views/admin/Reports/VendorReport.js";

import RefundRequest from "views/admin/Refund/RefundRequest.js";
import RefundSuccess from "views/admin/Refund/RefundSuccess.js";

import HomePageProductGroup from "views/admin/Homepage product group/HomePageProductGroup.js";
import ProductSubGroup from "views/admin/Homepage product group/ProductSubGroup.js";
import ProductSubGroupProduct from "views/admin/Homepage product group/ProductSubGroupProduct.js";
import CustomerWalletTransactionList from "views/admin/customers/WalletTransactionList.js";
import CustomerRefundTransactionList from "views/admin/customers/RefundTransactionList.js";
import CustomerOrderTransactionList from "views/admin/customers/OrderTransactionList.js";

import StockReport from "views/admin/Reports/StockReport.js";

import ShowCampaigns from "views/admin/Campaign/ShowCampaigns.js";
import Campaign from "views/admin/Campaign/Campaign.js";
import IndividualRowDetails from "views/admin/Campaign/IndividualRowDetails.js";
import ReturnProductReport from "views/admin/Reports/ReturnProductReport.js";
import CancelledOrderReport from "views/admin/Reports/CancelledOrderReport.jsx";

export default function Admin() {
    const { auth, token } = useSelector((state) => state.auth);

    let history = useHistory();

    const { loading, setLoading } = React.useContext(LoaderContext);
    const dispatch = useDispatch();

    const [menuCollapse, setMenuCollapse] = useState(true);

    // React.useEffect(() => {
    //     let localToken = localStorage.getItem("token");

    //     if (
    //         localToken === null ||
    //         localToken === "" ||
    //         localToken === undefined
    //     ) {
    //         setAuth(false);
    //         history.push("/auth/login");
    //         console.log("I am fff.");
    //     } else {
    //         setLoading(true);
    //         dispatch(setAuth(true));
    //         dispatch(getToken());

    //         if (token !== "") {
    //             axios
    //                 .get("/profile", { headers: { Authorization: token } })
    //                 .then((response) => {
    //                     dispatch(setUser(response.data));
    //                     setLoading(false);
    //                 })
    //                 .catch((errors) => {
    //                     console.log(errors.response?.data);
    //                     setAuth(false);
    //                     history.push("/auth/login");
    //                 });
    //         }
    //     }
    // }, [token]);

    // useEffect(() => {
    //   console.log(menuCollapse)

    // }, [menuCollapse])

    return (
        <div className="h-screen overflow-y-scroll bg-individualPageBG">
            <StyleProvider>
                <Loader loading={loading} />
                <Header
                    menuCollapse={menuCollapse}
                    setMenuCollapse={setMenuCollapse}
                />

                <div
                    className={`${menuCollapse ? "md:ml-20" : "md:ml-67.5"
                        } transition-all duration-200 ease-linear relative overflow-hidden`}
                >
                    <IndividualPageHeader />
                    {/* <div className="px-4 w-full h-full"> */}
                    <Switch>
                        <Route
                            path="/admin/dashboard"
                            exact
                            component={Dashboard}
                        />

                        <Route
                            path="/admin/sellers"
                            exact
                            component={Sellers}
                        />
                        <Route
                            path="/admin/seller/request"
                            exact
                            component={SellerRequestList}
                        />
                        <Route
                            path="/admin/seller-verification"
                            exact
                            component={SellerVerification}
                        />
                        <Route
                            path="/admin/sellers/create"
                            exact
                            component={CreateSeller}
                        />
                        <Route
                            path="/admin/seller-settings"
                            exact
                            component={SellerSettings}
                        />
                        <Route
                            path="/admin/seller-add-settings"
                            exact
                            component={AddSettingsRequirments}
                        />

                        <Route
                            path="/admin/suppliers/create"
                            exact
                            component={CreateSupplier}
                        />
                        <Route
                            path="/admin/sellers/:id/edit"
                            exact
                            component={EditSeller}
                        />
                        <Route
                            path="/admin/suppliers/:id/edit"
                            exact
                            component={EditSupplier}
                        />

                        <Route
                            path="/admin/suppliers"
                            exact
                            component={Suppliers}
                        />

                        <Route
                            path="/admin/sizechart"
                            exact
                            component={SizeChart}
                        />

                        <Route
                            path="/admin/categories"
                            exact
                            component={Category}
                        />
                        {/* <Route path="/admin/categories" exact component={Category} /> */}
                        <Route
                            path="/admin/categories/:id"
                            exact
                            component={SubCategory}
                        />
                        <Route
                            path="/admin/categories/sub-category/:id"
                            exact
                            component={ProductCategory}
                        />

                        <Route
                            path="/admin/brands"
                            exact
                            component={BrandList}
                        />
                        <Route
                            path="/admin/attributes"
                            exact
                            component={AttributeList}
                        />
                        <Route
                            path="/admin/attributes/:id"
                            exact
                            component={AttributeValueAddPage}
                        />

                        <Route
                            path="/admin/products-adding"
                            exact
                            component={NewProductAdding}
                        />
                        <Route
                            path="/admin/products-adding/:id/options"
                            exact
                            component={ProductAttribute}
                        />
                        <Route
                            path="/admin/all-products"
                            exact
                            component={ProductList}
                        />
                        <Route
                            path="/admin/product/:id"
                            exact
                            component={EditProduct}
                        />

                        <Route
                            path="/admin/settings"
                            exact
                            component={Settings}
                        />
                        <Route path="/admin/tables" exact component={Tables} />
                        <Route path="/admin/users" exact component={Users} />
                        <Route
                            path="/admin/users/add"
                            exact
                            component={AddUser}
                        />
                        <Route
                            path="/admin/users/:id/edit"
                            exact
                            component={EditUser}
                        />
                        <Route
                            path="/admin/users/:id/permission"
                            exact
                            component={UserPermission}
                        />
                        <Route
                            path="/admin/orders"
                            exact
                            component={AllOrder}
                        />
                        <Route
                            path="/admin/orders/:status"
                            exact
                            component={AllOrder}
                        />
                        <Route
                            path="/admin/orders/:id/details"
                            exact
                            component={UpdateOrder}
                        />
                        <Route
                            path="/admin/pos-system"
                            exact
                            component={PointOfSaleSystem}
                        />
                        <Route
                            path="/admin/customers"
                            exact
                            component={Customers}
                        />
                        <Route
                            path="/admin/shipping/class"
                            exact
                            component={ShippingClass}
                        />
                        <Route
                            path="/admin/shipping/class/:id/edit"
                            exact
                            component={AddCities}
                        />
                        <Route
                            path="/admin/navigation"
                            exact
                            component={NavigationMenu}
                        />
                        <Route
                            path="/admin/navigation/add"
                            exact
                            component={AddNavigationMenu}
                        />
                        <Route
                            path="/admin/navigation/:id/edit"
                            exact
                            component={EditNavigationMenu}
                        />
                        <Route
                            path="/admin/navigation/:id/show"
                            exact
                            component={ShowNavigationMenu}
                        />
                        <Route
                            path="/admin/navigation/:id/item"
                            exact
                            component={AddNavigationItem}
                        />
                        <Route path="/admin/menus" exact component={MenuList} />
                        <Route
                            path="/admin/homepage/categories"
                            exact
                            component={HomePageCategories}
                        />
                        <Route
                            path="/admin/menus/:id/items"
                            exact
                            component={MenuItems}
                        />
                        <Route
                            path="/admin/menus/:id/add"
                            exact
                            component={AddItem}
                        />
                        <Route
                            path="/admin/reviews"
                            exact
                            component={ProductReviews}
                        />
                        <Route
                            path="/admin/newsletters"
                            exact
                            component={Newsletters}
                        />
                        <Route
                            path="/admin/newsletters/send"
                            exact
                            component={SendNewsletter}
                        />

                        {/* Courier Route */}
                        <Route
                            path="/admin/couriers"
                            exact
                            component={Couriers}
                        />
                        <Route
                            path="/admin/couriers/add"
                            exact
                            component={AddCourier}
                        />
                        <Route
                            path="/admin/couriers/:id/edit"
                            exact
                            component={EditCourier}
                        />
                        {/* Coupon Route */}
                        <Route
                            path="/admin/cupon"
                            exact
                            component={AddingCupon}
                        />
                        <Route
                            path="/admin/cupon/edit/:state"
                            exact
                            component={EditingCupon}
                        />
                        <Route
                            path="/admin/allCupons"
                            exact
                            component={AllCupons}
                        />
                        <Route
                            path="/admin/offers"
                            exact
                            component={OfferComponent}
                        />

                        {/* Deals of the day */}
                        <Route path="/admin/deals" exact component={Deals} />

                        {/* Best Seller */}
                        <Route
                            path="/admin/bestellers"
                            exact
                            component={BestSeller}
                        />

                        {/* Banners */}
                        <Route
                            path="/admin/homepageBanner"
                            exact
                            component={HomePageBannerSlider}
                        />
                        <Route
                            path="/admin/categoryBanner"
                            exact
                            component={CategoryBannerSlider}
                        />
                        <Route
                            path="/admin/categoryBanner/add"
                            exact
                            component={CategoryBannerCreateSlider}
                        />
                        <Route
                            path="/admin/categoryBanner/addbanner"
                            exact
                            component={CategoryBannerCreateBanner}
                        />

                        <Route
                            path="/admin/subcategoryBanner"
                            exact
                            component={SubCategoryBannerSlider}
                        />
                        <Route
                            path="/admin/subcategoryBanner/add"
                            exact
                            component={SubCategoryBannerCreateSlider}
                        />
                        <Route
                            path="/admin/subcategoryBanner/addbanner"
                            exact
                            component={SubCategoryBannerCreateBanner}
                        />

                        {/* Payout */}
                        <Route
                            path="/admin/payoutpending"
                            exact
                            component={PayoutHistoryPending}
                        />
                        <Route
                            path="/admin/payouthistory"
                            exact
                            component={PayoutHistory}
                        />
                        <Route
                            path="/admin/payouthistory/:id/edit"
                            exact
                            component={PayoutHistoryEdit}
                        />
                        <Route
                            path="/admin/payoutpaidhistory/:id/edit"
                            exact
                            component={PayoutPaidHistoryEdit}
                        />

                        {/* end payout */}

                        {/* Page */}
                        <Route path="/admin/page" exact component={PageList} />
                        <Route
                            path="/admin/page/add"
                            exact
                            component={CreatePage}
                        />
                        <Route
                            path="/admin/page/:id/edit"
                            exact
                            component={EditPage}
                        />

                        {/* FAQ's  */}
                        <Route path="/admin/faqs" exact component={Faqs} />

                        {/* Testimonial  */}
                        <Route
                            path="/admin/testimonials"
                            exact
                            component={Testimonials}
                        />

                        <Route path="/admin/page" exact component={PageList} />
                        <Route
                            path="/admin/page/add"
                            exact
                            component={CreatePage}
                        />
                        <Route path="/admi/edit" exact component={EditPage} />
                        {/* end Page */}

                        {/* Contact */}
                        <Route
                            path="/admin/contact"
                            exact
                            component={ContactList}
                        />
                        <Route
                            path="/admin/contact/:id"
                            exact
                            component={ContactDetails}
                        />
                        {/* End Contact */}

                        {/* Menu Management */}
                        <Route
                            path="/admin/manumanage"
                            exact
                            component={NewMenuList}
                        />
                        <Route
                            path="/admin/manumanage/:id/item"
                            exact
                            component={NewMenuAdd}
                        />
                        <Route
                            path="/admin/manumanage/:id/edit"
                            exact
                            component={NewMenuEdit}
                        />
                        {/* End Menu management */}

                        {/* Social Link management */}
                        <Route
                            path="/admin/socialmenu"
                            exact
                            component={SocialMenuList}
                        />
                        <Route
                            path="/admin/socialmenu/add"
                            exact
                            component={AddSocialMenu}
                        />
                        <Route
                            path="/admin/socialmenu/:id/edit"
                            exact
                            component={EditSocialMenu}
                        />

                        {/* invoice print */}
                        <Route
                            path="/admin/order/invoice/print/:slug"
                            exact
                            component={InvoicePrint}
                        />

                        {/* Reports */}
                        <Route
                            path="/admin/reports/order-report"
                            exact
                            component={OrderReport}
                        />
                        <Route
                            path="/admin/reports/logistic-requisition-report"
                            exact
                            component={LogisticRequisitionReport}
                        />
                        <Route
                            path="/admin/reports/sales-report"
                            exact
                            component={SalesReports}
                        />
                        <Route
                            path="/admin/reports/payment-method"
                            exact
                            component={PaymentMethodReport}
                        />
                        <Route
                            path="/admin/reports/vendor"
                            exact
                            component={VendorReport}
                        />
                        <Route
                            path="/admin/reports/stock"
                            exact
                            component={StockReport}
                        />
                        <Route
                            path="/admin/reports/return-product-report"
                            exact
                            component={ReturnProductReport}
                        />
                        <Route
                            path="/admin/reports/cancelled-order-report"
                            exact
                            component={CancelledOrderReport}
                        />

                        {/* Refund */}
                        <Route
                            path="/admin/refund-request"
                            exact
                            component={RefundRequest}
                        />
                        <Route
                            path="/admin/refund/:slug"
                            exact
                            component={RefundSuccess}
                        />

                        {/* Home page product group */}
                        <Route
                            path="/admin/homepage-prouduct-group"
                            exact
                            component={HomePageProductGroup}
                        />
                        <Route
                            path="/admin/homepage-prouduct-sub-group/:slug"
                            exact
                            component={ProductSubGroup}
                        />
                        <Route
                            path="/admin/homepage-prouduct-sub-group-product/:slug"
                            exact
                            component={ProductSubGroupProduct}
                        />

                        <Route
                            path="/admin/customers/:customerId/refund-transactions"
                            exact
                            component={CustomerRefundTransactionList}
                        />
                        <Route
                            path="/admin/customers/:customerId/wallet-transactions"
                            exact
                            component={CustomerWalletTransactionList}
                        />
                        <Route
                            path="/admin/customers/:customerId/order-transactions"
                            exact
                            component={CustomerOrderTransactionList}
                        />

                        {/* Campaigns Panel */}
                        <Route
                            path="/admin/campaign"
                            exact
                            component={ShowCampaigns}
                        />
                        <Route
                            path="/admin/campaign/:campaign_name"
                            exact
                            component={Campaign}
                        />
                        <Route
                            path="/admin/campaign/:row_type/:row_name"
                            exact
                            component={IndividualRowDetails}
                        />

                        <Redirect from="/admin" to="/admin/dashboard" />
                    </Switch>
                    {/* </div> */}
                </div>
                {/* </div> */}
            </StyleProvider>
        </div>
    );
}
