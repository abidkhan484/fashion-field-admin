import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'

export default function MenuItems() {

    const {id} = useParams();
    const { token } = useSelector(state => state.auth)
    const [menu, setMenu] = React.useState(null);
    const [items, setItems] = React.useState([]);

    const fetchItems = () => {
        axios.get(`/menus/${id}/items`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            // console.log(response.data);
            setItems(response.data.items);
            setMenu(response.data.menu);
        }).catch(error => {
            console.log(error.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchItems();
        }
    }, [token]);

    return (
        <>
            <div className="px-8 mt-8 mb-8">
                <div className="page-heading">
                    <h1 className="pageHeading">Menu items of {menu?.name}</h1>
                    <div className="flex">
                        <Link to={`/admin/menus/${id}/add`}><p className="button button-primary px-2">Add Item</p></Link>
                    </div>
                </div>
                <div className="card">
                    <div className="border-b">
                        <div className="card-header">
                            <div>
                                <h4 className="pageHeading">Menu Items</h4>
                            </div>
                            {/* <input className="inputBox" placeholder="Search" onChange={e => setSearch(e.target.value)} /> */}
                            {/* <input className="inputBox" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Order Number, Customer Name, Phone Number" /> */}
                        </div>
                    </div>
                    <div className="card-body overflow-x-auto">
                        <ul className="w-72">
                            {items.map((item, index) => (
                                <li key={index} className="border p-2 block">
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
