import React from 'react'

const delegateData = [
    {
        id: 1,
        username: 'vruddhi_grtnr@ordextechnology.com',
        firstName: 'Vruddhi',
        lastName: 'Shah',
        title: 'Guarantor',
        COIFor: 'Guarantor_Vruddhi Shah',
        lastLogin: '2018-03-22 09:57:42',
    },
    {
        id: 2,
        username: 'vruddhi.shah1@ordextechnology.com',
        firstName: 'Vruddhi',
        lastName: 'Shah',
        title: 'Guarantor',
        COIFor: '',
        lastLogin: '2018-03-26 05:11:57',
    },
    {
        id: 3,
        username: 'pheebs_coi@ordextechnology.com',
        firstName: 'Pheobe',
        lastName: 'Buffay',
        title: 'COI',
        COIFor: 'Company_test mail',
        lastLogin: '2018-03-22 13:05:45',
    }
]

const ManageDelegateDetails: React.FC = () => {
    return (
        <div className='max-w-[90%] md:max-w-[70%] mx-auto my-12'>
            <div className='w-full overflow-x-auto'>
                <table className='w-full border-collapse border border-[#eceeef]'>
                    <thead className='font-semibold text-(--label)'>
                        <tr className='*:p-3 *:bg-[#fbf7f7] *:border *:border-[#eceeef]'>
                            <th>Username</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Title</th>
                            <th>COI For?</th>
                            <th>Last Login</th>
                            <th>Reset Password</th>
                            <th>Delete User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            delegateData.map(delegate => (
                                <tr key={delegate.id} className='*:p-3 *:text-center text-(--label) *:border *:border-[#eceeef] [&_a]:text-(--primary-color)'>
                                    <td>{delegate.username}</td>
                                    <td>{delegate.firstName}</td>
                                    <td>{delegate.lastName}</td>
                                    <td>{delegate.title}</td>
                                    <td>{delegate.COIFor}</td>
                                    <td>{delegate.lastLogin}</td>
                                    <td><a>Yes</a></td>
                                    <td><a>Yes</a></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ManageDelegateDetails
