import React from 'react'

export default function Table({children, searchSeller}) {
    return (
        <>
        <div className="block w-full overflow-x-auto">
          <div className="text-right">
              <span className="z-5 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-2">
                <i className="fas fa-search"></i>
              </span>
              <input className="bg-white px-4 py-2 pl-9 text-sm shadow border" onChange={(e) => searchSeller(e)} placeholder="Search" />
          </div>
          <table className="items-center w-full bg-transparent border-collapse">
            {children}
          </table>
        </div>
        </>
    )
}
