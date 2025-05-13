import React from 'react'

const delegates = [
    {
        id: 1,
        name: 'Test Name 1',
        code: 'LH-S1000001',
    },
    {
        id: 2,
        name: 'Test Name 2',
        code: 'LH-S1000002',
    },
    {
        id: 3,
        name: 'Test Name 3',
        code: 'LH-S1000003',
    },
    {
        id: 4,
        name: 'Test Name 4',
        code: 'LH-S1000004',
    },
    {
        id: 5,
        name: 'Test Name 5',
        code: 'LH-S1000005',
    },
]

const ManageDelegates: React.FC = () => {
    return (
        <div className='max-w-[90%] md:max-w-[70%] mx-auto my-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7'>
                {
                    delegates.map((delegate) => (
                        <a key={delegate.id}>
                            <div className='flex flex-col items-center justify-center bg-[#fff] rounded-[4px] px-5 py-2 shadow-lg border border-[#d7dfe3] w-full'>
                                <h4 className='text-md text-[#373a3c] font-semibold text-center'>{delegate.name}</h4>
                                <p className='text-sm text-(--label)'>{delegate.code}</p>
                            </div>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}

export default ManageDelegates
