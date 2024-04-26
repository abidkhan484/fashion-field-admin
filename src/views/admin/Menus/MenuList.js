import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MenuList() {

    const { token } = useSelector(state => state.auth)

    const [menus, setMenus] = React.useState([]);

    const fetchMenus = () => {
        axios.get(`/menus`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response.data);
            setMenus(response.data);
        }).catch(error => {
            console.log(error.response);
        })
    }

    React.useEffect(() => {
        if(token != '')
        {
            fetchMenus();
        }
    }, [token]);

    return (
        <div className="px-8 mt-8 mb-8">
            <div className="page-heading">
                <h1 className="pageHeading">Menus</h1>
                <div className="flex">
                    
                </div>
            </div>
            <div className="card">
                <div className="card-body overflow-x-auto">
                    <table className="w-350 2xl:w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Menu Name</th>
                                <th className="tableHeader w-18">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.map((item, index) => (
                                <tr key={index} className="border-b py-4 h-20">
                                    <td><p className="tableData"><Link to={`/admin/menus/${item.id}/items`}>{item.name}</Link></p></td>
                                    <td>
                                        <Link><i class="fas fa-edit"></i></Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
