import React from 'react'
import { redirect } from 'next/navigation'
import NavBar from '../components/NavBar'
import ResumeBuilder from '../components/builder/ResumeBuilder'
import { getAccount } from '../lib/serverApi'

const ResumePage = async () => {
    const result = await getAccount()

    if (result.status === 'unauthenticated') redirect('/auth/signin')

    const account = result.status === 'ok' ? result.account : undefined

    return (
        <>
            <NavBar email={account?.email} />
            <ResumeBuilder
                savedContent={account?.resume?.content}
                loadError={result.status === 'error' ? result.message : undefined}
            />
        </>
    )
}

export default ResumePage
