'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AlertIcon, CheckIcon } from './Icons'

type ToastKind = 'success' | 'error' | 'info'

type Toast = { id: number; kind: ToastKind; message: string }

type ToastContextValue = {
    notify: (kind: ToastKind, message: string) => void
}

const ToastContext = createContext<ToastContextValue>({ notify: () => undefined })

/** Replaces window.alert so errors do not block the page. */
export const useToast = () => useContext(ToastContext)

const styles: Record<ToastKind, string> = {
    success: 'alert-success',
    error: 'alert-error',
    info: 'alert-info',
}

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const notify = useCallback((kind: ToastKind, message: string) => {
        const id = Date.now() + Math.random()

        setToasts((current) => [...current, { id, kind, message }])
        window.setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), kind === 'error' ? 7000 : 4000)
    }, [])

    const value = useMemo(() => ({ notify }), [notify])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="toast toast-end z-50 max-w-[92vw] whitespace-normal">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`alert ${styles[toast.kind]} animate-fade-in-up shadow-lg`} role="status">
                        {toast.kind === 'success' ? <CheckIcon className="size-5 shrink-0" /> : <AlertIcon className="size-5 shrink-0" />}
                        <span className="text-sm">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastProvider
