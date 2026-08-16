import { redirect } from 'next/navigation'

/** The profile page became the resume builder; keep old links working. */
const ProfilePage = () => redirect('/resume')

export default ProfilePage
