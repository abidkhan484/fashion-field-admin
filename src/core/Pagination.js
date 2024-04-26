import React from 'react'

export default function Pagination({sellers, setUpdate}) {

    return (
        <>
            <div className="flex items-center">

                {(sellers.current_page === 1) ? (
                        <>
                            <button className="button-rounded-default" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setUpdate(sellers?.links[sellers?.current_page-1].url) } className="button-rounded-default">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                            </button>
                        </>
                )}

                { sellers?.links?.map((item, index) => (
                        <span key={index}>
                            { ((index > 1) ||  (item.label <= sellers.last_page)) ? (
                                    <>

                                    {(item.label <= sellers.last_page) ? (
                                        <>
                                        {(item.active) ? (
                                            <>
                                            <button className="button-rounded-primary">{item.label}</button>
                                            </>
                                        ) : (
                                            <>
                                            <button onClick={() => setUpdate(item.url) } className="button-rounded-default-outline"><span dangerouslySetInnerHTML={{__html: item.label}} /></button>
                                            </>
                                        )}
                                        </>
                                    ) : (
                                        <>
                                            {(item.label === "...") ? (
                                                <>
                                                <button className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 shadow hover:shadow-md outline-none focus:outline-none mb-1 ease-linear transition-all duration-150">{item.label}</button>
                                                </>
                                            ) : ""}
                                        </>
                                    )}


                                    
                                    </>
                                ) : ''
                            }
                        </span>
                    )) 
                }

                {(sellers?.current_page === sellers?.last_page) ? (
                        <>
                            <button className="button-rounded-default" disabled>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setUpdate(sellers.links[sellers.current_page+1].url) } className="button-rounded-default">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                            </button>
                        </>
                )}
                

            </div>
        </>
    )
}
