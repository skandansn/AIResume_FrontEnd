import { ResumeProfile } from './types'

/**
 * Keeps an editable copy of the resume form in the browser.
 *
 * The account stores the two artifacts the API needs (the resume text and the
 * generated template), but it does not store the structured form, and there is
 * no endpoint to read the template back. So this device keeps the editable
 * version, and /resume can also rebuild most of it from the saved text.
 * Users can move between devices with the export/import buttons.
 */

const KEY = 'airesume.profile.v1'

export const loadProfile = (): ResumeProfile | null => {
    if (typeof window === 'undefined') return null

    try {
        const raw = window.localStorage.getItem(KEY)
        return raw ? (JSON.parse(raw) as ResumeProfile) : null
    } catch {
        return null
    }
}

export const saveProfile = (profile: ResumeProfile): void => {
    if (typeof window === 'undefined') return

    try {
        window.localStorage.setItem(KEY, JSON.stringify(profile))
    } catch {
        // A full or blocked storage is not worth interrupting the user for.
    }
}

export const downloadProfile = (profile: ResumeProfile): void => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'my-resume-details.json'
    anchor.click()
    URL.revokeObjectURL(url)
}

export const readProfileFile = async (file: File): Promise<ResumeProfile> => {
    const parsed = JSON.parse(await file.text()) as ResumeProfile

    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.experience)) {
        throw new Error('That file does not look like an exported resume.')
    }

    return parsed
}
