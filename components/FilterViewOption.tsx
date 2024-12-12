'use client'

import {useState} from "react";

export interface FilterViewOptionProps {
    header?: string
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
            className={`${expanded ? `min-h-16` : `hidden`} bg-white/30 p-2`}
        >

        </div>
    </div>
}