import React from 'react'

type FieldProps = {
    label: string
    hint?: string
    optional?: boolean
    className?: string
    children: React.ReactNode
}

export const Field = ({ label, hint, optional, className = '', children }: FieldProps) => (
    <label className={`form-control w-full ${className}`}>
        <div className="label pb-1 pt-0">
            <span className="label-text font-medium">
                {label}
                {optional && <span className="ml-1 font-normal text-base-content/50">(optional)</span>}
            </span>
        </div>
        {children}
        {hint && <div className="label pb-0 pt-1"><span className="label-text-alt text-base-content/55">{hint}</span></div>}
    </label>
)

type TextFieldProps = Omit<FieldProps, 'children'> &
    React.InputHTMLAttributes<HTMLInputElement> & { label: string }

export const TextField = ({ label, hint, optional, className, ...inputProps }: TextFieldProps) => (
    <Field label={label} hint={hint} optional={optional} className={className}>
        <input {...inputProps} className="input input-bordered w-full" />
    </Field>
)

type TextAreaFieldProps = Omit<FieldProps, 'children'> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }

export const TextAreaField = ({ label, hint, optional, className, ...textAreaProps }: TextAreaFieldProps) => (
    <Field label={label} hint={hint} optional={optional} className={className}>
        <textarea {...textAreaProps} className="textarea textarea-bordered w-full leading-relaxed" />
    </Field>
)

type SectionCardProps = {
    title: string
    description?: string
    action?: React.ReactNode
    children: React.ReactNode
}

export const SectionCard = ({ title, description, action, children }: SectionCardProps) => (
    <section className="panel p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h2 className="panel-title">{title}</h2>
                {description && <p className="panel-hint mt-1">{description}</p>}
            </div>
            {action}
        </div>
        {children}
    </section>
)
