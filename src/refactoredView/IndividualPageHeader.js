import React from 'react'
import UserDropdown from 'components/Dropdowns/UserDropdown'

const IndividualPageHeader = () => {
    return (
        <div className="px-8 h-18 bg-white flex items-center w-full shadow-md justify-end">
            <UserDropdown />
        </div>
    )
}

export default IndividualPageHeader
