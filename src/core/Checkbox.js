import React from 'react'

export default function Checkbox({type, id, checked, change}) {

    const changeStatus = () => {
        change(!checked);
    }

    return (
        <input type="checkbox" id={id} defaultChecked={checked} onChange={changeStatus} />
    )
}
