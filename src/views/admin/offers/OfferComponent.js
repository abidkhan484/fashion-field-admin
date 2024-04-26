import axios from 'axios'
import React from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import categories from 'redux/categories'
import BrandOffers from './BrandOffers'
import CategoryOffers from './CategoryOffers'
import ProductCategoryOffers from './ProductCategoryOffers'
import ProductOffer from './ProductOffer'
import StoreOffers from './StoreOffers'
import SubCategoryOffers from './SubCategoryOffers'
import { permission } from 'helper/permission'
import { useHistory } from 'react-router-dom'

export default function OfferComponent() {
    const { token, user } = useSelector(state => state.auth);

    const [categories, setCategories] = React.useState('');

    let history = useHistory();

    React.useEffect(() => {
        if(user?.permissions)
        {
            if(!(permission(user.permissions, 'offers_manage_offer', 'access')) && (user.user_type_id != 1))
                history.push('/admin');
        }
    }, [user])

    const fetchCategory = () => {
        axios.get(`/categories/single`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            setCategories([]);
            response.data.map((item, index) => {
                setCategories(prevState => [...prevState, {label: item.name, value: item.id}])
            })
        }).catch(error => {
            console.log(error.response);
        })
    }

    React.useEffect(() => {
        fetchCategory();
    }, [token]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Manage Offers</h1>
                    <div className="flex">
                        
                    </div>
                </div>
                <ProductOffer />
                <CategoryOffers categories={categories} />
                <SubCategoryOffers categories={categories} />
                <ProductCategoryOffers categories={categories} />
                <BrandOffers />
                <StoreOffers />
            </div>
        </>
    )
}
