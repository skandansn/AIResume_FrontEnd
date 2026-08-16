import React from 'react'
import { redirect } from 'next/navigation'
import NavBar from './components/NavBar'
import TailorWorkspace from './components/tailor/TailorWorkspace'
import { getAccount } from './lib/serverApi'
import { hasStoredResume } from './lib/resumeContent'

/** Turns a stored template file name into something worth showing a person. */
const templateLabel = (fileName: string): string => {
    const cleaned = fileName
        .replace(/\.tex$/i, '')
        .replace(/_Template$/i, '')
        .replace(/[_-]+/g, ' ')
        .trim()

    return cleaned || fileName
}

const Home = async () => {
    const result = await getAccount()

    if (result.status === 'unauthenticated') redirect('/auth/signin')

    const account = result.status === 'ok' ? result.account : undefined
    const loadError = result.status === 'error' ? result.message : undefined

    const resumeSaved = hasStoredResume(account?.resume?.content)
    const labelCount = account?.resume?.label_count

    // The API refuses to build a resume unless the saved text and the layout
    // describe the same number of blocks, so only offer layouts that match.
    // Layouts saved before the move off file storage have no template stored
    // and would fail at the last step, so they are treated as unusable too.
    const templates = (account?.tex_files ?? [])
        .filter((file) => file.label_count === labelCount && file.has_content !== false)
        .map((file) => ({ fileName: file.file_name, label: templateLabel(file.file_name) }))

    const missing: string[] = []
    if (!resumeSaved) missing.push('Your skills, roles and projects')
    if (resumeSaved && templates.length === 0) missing.push('A saved layout that matches your details — save your resume once more')
    if (!account?.output_resume_name) missing.push('A name for your resume file')

    const ready = resumeSaved && templates.length > 0 && Boolean(account?.output_resume_name) && !loadError

    return (
        <>
            <NavBar email={account?.email} />
            <TailorWorkspace
                ready={ready}
                templates={templates}
                missing={missing}
                loadError={loadError}
                downloadName={`${account?.output_resume_name ?? 'resume'}.pdf`}
                savedResumeText={account?.resume?.content ?? ''}
            />
        </>
    )
}

export default Home
