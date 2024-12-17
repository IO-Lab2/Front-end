'use client'

import React, {useState} from "react";

export interface FilterViewOptionProps {
    header?: string
    children?: React.ReactNode
}

export interface FilterCheckboxProps {
    label: string
    count: number
    isChecked?: boolean
    onChoice?: (isChecked: boolean) => void
}

export function FilterCheckbox(props: FilterCheckboxProps) {
    const onChoice = props.onChoice

    return <div className={`m-1`}>
        <input
            className={`m-1 size-5 align-middle`}
            type="checkbox"
            checked={props.isChecked}
            onChange={
                onChoice ? (value) => { onChoice(value.target.checked) } : undefined
            }/>
        <span className={`p-2 font-[600] align-middle`}>{props.label}</span>
        <span className={`align-middle`}>({props.count})</span>
    </div>
}

export function FilterViewOption(props: FilterViewOptionProps) {
    const [expanded, setExpanded] = useState(false)

    return <div className={`group/filter_view`}>
        <div
            className={
                `p-2 min-h-16 w-full content-center cursor-pointer group-odd/filter_view:bg-black/80 group-even/filter_view:bg-black/70`
            }
            onClick={() => { setExpanded(!expanded) }}
        >
            <p className={`text-basetext text-2xl font-[600]`}>{props.header}</p>
        </div>
        <div
            className={`${expanded ? `min-h-12` : `hidden`} bg-white/30 p-2`}
        >
            {props.children}
        </div>
    </div>
}