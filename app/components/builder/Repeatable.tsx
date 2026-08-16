import React from 'react'
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from '../ui/Icons'

/** Frame around one repeated entry, with reorder and remove controls. */
export const EntryCard = ({
    title,
    index,
    total,
    onMove,
    onRemove,
    removeLabel,
    children,
}: {
    title: string
    index: number
    total: number
    onMove: (direction: -1 | 1) => void
    onRemove: () => void
    removeLabel: string
    children: React.ReactNode
}) => (
    <div className="rounded-box border border-base-300 bg-base-200/50 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-base-content/80">{title}</h3>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => onMove(-1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    title="Move up"
                >
                    <ChevronUpIcon className="size-4" />
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => onMove(1)}
                    disabled={index === total - 1}
                    aria-label="Move down"
                    title="Move down"
                >
                    <ChevronDownIcon className="size-4" />
                </button>
                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={onRemove} title={removeLabel}>
                    <TrashIcon className="size-4" />
                    <span className="sr-only">{removeLabel}</span>
                </button>
            </div>
        </div>
        {children}
    </div>
)

export const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button type="button" className="btn btn-outline btn-sm" onClick={onClick}>
        <PlusIcon className="size-4" />
        {label}
    </button>
)

/** The bullet points under a role or project. */
export const BulletList = ({
    bullets,
    onChange,
    placeholder,
    addLabel,
}: {
    bullets: string[]
    onChange: (bullets: string[]) => void
    placeholder: string
    addLabel: string
}) => {
    const update = (index: number, value: string) => onChange(bullets.map((b, i) => (i === index ? value : b)))
    const remove = (index: number) => onChange(bullets.filter((_, i) => i !== index))

    return (
        <div className="space-y-2">
            {bullets.map((bullet, index) => (
                <div key={index} className="flex items-start gap-2">
                    <span className="mt-3.5 size-1.5 shrink-0 rounded-full bg-base-content/40" aria-hidden="true" />
                    <textarea
                        className="textarea textarea-bordered min-h-[4.5rem] w-full leading-relaxed"
                        rows={2}
                        placeholder={placeholder}
                        value={bullet}
                        onChange={(e) => update(index, e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-ghost btn-sm mt-1 text-error"
                        onClick={() => remove(index)}
                        disabled={bullets.length === 1}
                        aria-label="Remove this point"
                        title="Remove this point"
                    >
                        <TrashIcon className="size-4" />
                    </button>
                </div>
            ))}
            <button type="button" className="btn btn-ghost btn-sm text-primary" onClick={() => onChange([...bullets, ''])}>
                <PlusIcon className="size-4" />
                {addLabel}
            </button>
        </div>
    )
}

/** Immutable list helpers shared by every repeated section. */
export const listHelpers = <T,>(items: T[], setItems: (next: T[]) => void) => ({
    update: (index: number, patch: Partial<T>) => setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item))),
    add: (item: T) => setItems([...items, item]),
    remove: (index: number) => setItems(items.filter((_, i) => i !== index)),
    move: (index: number, direction: -1 | 1) => {
        const target = index + direction
        if (target < 0 || target >= items.length) return

        const next = [...items]
        ;[next[index], next[target]] = [next[target], next[index]]
        setItems(next)
    },
})
