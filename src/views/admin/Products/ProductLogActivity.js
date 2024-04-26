import React from 'react'
import Pagination from 'core/Pagination'
import axios from 'axios';

const ProductLogActivity = props => {
    const { logActivity, setProductLogActivity, token } = props
    const updatePage = (url) => {
        axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setProductLogActivity(response.data)
        })
    }
    return (
        <div className="w-full mt-4">

            <div className="card">
                <div className="card-header">
                    <div>
                        <h4 className="pageHeading">Log Activity</h4>
                    </div>
                </div>

                <div className="card-body py-4 w-full overflow-x-auto overflow-y-auto" style={{ height: 800 }}>
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b h-12">
                                <th className="tableHeader">Variation</th>
                                <th className="tableHeader">Update Message</th>
                                <th className="tableHeader">Updated By</th>
                            </tr>
                        </thead>

                        <tbody className=''>
                            {
                                logActivity?.data?.map((value, index) => (
                                    <tr key={index} className="border-b py-4 h-20">

                                        <td>
                                            <p className="tableData">{value.variation}</p>
                                        </td>

                                        <td>
                                            <p className="tableData">{value.description}</p>
                                            <p className="tableData"><b>New Stock:</b> {value.updated_stock?.newStock}</p>
                                            <p className="tableData"><b>Previous Stock:</b> {value.updated_stock?.previousStock}</p>
                                        </td>

                                        <td>
                                            <p className="tableData">{value.updated_by?.name}</p>
                                            <p className="tableData">{value.updated_by?.email}</p>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>

                    </table>

                </div>

                <div className="card-footer">
                    <div className="flex flex-col justify-between md:flex-row items-center w-full">
                        <p className="font-Poppins font-normal text-sm">Showing <b>{logActivity?.meta?.from} - {logActivity?.meta?.to}</b> from <b>{logActivity?.meta?.total}</b> data</p>

                        <div className="flex items-center">
                            <Pagination sellers={logActivity?.meta} setUpdate={updatePage} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ProductLogActivity