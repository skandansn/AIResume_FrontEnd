import React from 'react'

type IconProps = { className?: string }

const base = 'size-5'

export const SparkleIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.9 4.9L18.8 10l-4.9 1.9L12 17l-1.9-5.1L5.2 10l4.9-2.1L12 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" />
    </svg>
)

export const DownloadIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0l-4-4m4 4l4-4M4 19h16" />
    </svg>
)

export const PlusIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
)

export const TrashIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M10 11v6m4-6v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
)

export const ChevronUpIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
    </svg>
)

export const ChevronDownIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
)

export const CheckIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
)

export const UserIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.6 0-6.5 2-6.5 4.5V20h13v-1.5C18.5 16 15.6 14 12 14z" />
    </svg>
)

export const LogoutIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 5h3a1 1 0 011 1v12a1 1 0 01-1 1h-3M11 8l-4 4 4 4M7 12h8" />
    </svg>
)

export const DocumentIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V7l-4-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v4h4M9 13h6M9 17h6" />
    </svg>
)

export const ExternalIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5l-7 7M18 14v4a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h4" />
    </svg>
)

export const AlertIcon = ({ className = base }: IconProps) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 3h.01M10.3 4.3L2.9 17a1.5 1.5 0 001.3 2.2h15.6a1.5 1.5 0 001.3-2.2L13.7 4.3a1.5 1.5 0 00-2.6 0z" />
    </svg>
)
