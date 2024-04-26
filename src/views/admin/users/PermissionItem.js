import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';

export default function PermissionItem({type, user, permissions}) {
    
    const { token } = useSelector(state => state.auth)

    const [create, setCreate] = React.useState(false);
    const [read, setRead] = React.useState(false);
    const [update, setUpdate] = React.useState(false);
    const [del, setDel] = React.useState(false)

    const changePermission = (create, read, update, del) => {
        axios.post(`user/permission`, {
            user_id: user,
            menu_item: type,
            create: create,
            read: read,
            update: update,
            delete: del
        }, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        }).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error.response);
        })
    }

    // React.useEffect(() => {
    //     changePermission()
    // }, [create])

    // React.useEffect(() => {
    //     changePermission()
    // }, [read])

    // React.useEffect(() => {
    //     changePermission()
    // }, [update])

    // React.useEffect(() => {
    //     changePermission()
    // }, [del])

    React.useEffect(() => {
        let item = permissions?.filter((item) => item.menu_item == type)
        if(item?.length === 1)
        {
            setCreate(item[0].create)
            setRead(item[0].read)
            setUpdate(item[0].update)
            setDel(item[0].delete)
        }else{
            setCreate(false);
            setRead(false);
            setUpdate(false);
            setDel(false);
        }
    }, [permissions])


    // React.useEffect(() => {
    //     changePermission()
    // }, [create, read, update, del])

    return (
        <tr className="border-b h-12">
            <td className='font-bold capitalize'>
                {type.replace('_', ' - ')}
            </td>
            <td>
                <input type='checkbox' checked={create ? 'checked' : ''} onChange={() => [setCreate(!create), changePermission(!create, read, update, del)]} />
            </td>
            <td>
                <input type='checkbox' checked={read ? 'checked' : ''} onChange={() => [setRead(!read), changePermission(create, !read, update, del)]} />
            </td>
            <td>
                <input type='checkbox' checked={update ? 'checked' : ''} onChange={() => [setUpdate(!update), changePermission(create, read, !update, del)]} />
            </td>
            <td>
                <input type='checkbox' checked={del ? 'checked' : ''}onChange={() => [setDel(!del), changePermission(create, read, update, !del)]} />
            </td>
        </tr>
    )
}
