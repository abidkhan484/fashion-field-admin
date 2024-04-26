import axios from 'axios';
import React from 'react'

export default function BannerHomepage({type, user_id}) {

    const [crate, setCreate] = React.useState(false);
    const [read, setRead] = React.useState(false);
    const [update, setUpdate] = React.useState(false);
    const [del, setDel] = React.useState(false)

    const changePermission = () => {
        // axios
    }

    return (
        <tr className="border-b h-12">
            <td className='font-bold capitalize'>
                {type.replace('_', ' - ')}
            </td>
            <td>
                <input type='checkbox' checked={crate ? 'checked' : ''} onChange={() => setCreate(!crate)} />
            </td>
            <td>
                <input type='checkbox' checked={read ? 'checked' : ''} onChange={() => setRead(!read)} />
            </td>
            <td>
                <input type='checkbox' checked={update ? 'checked' : ''} onChange={() => setUpdate(!update)} />
            </td>
            <td>
                <input type='checkbox' checked={del ? 'checked' : ''}onChange={() => setDel(!del)} />
            </td>
        </tr>
    )
}
