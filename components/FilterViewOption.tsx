'use client'

import React, {useContext} from "react";
import {ContrastState} from "@/components/Toolbar";
import {ARROW_DOWN, ARROW_RIGHT} from "@/components/Icons";

export interface FilterViewOptionProps {
    header?: string
    expanded?: boolean
    onExpanded?: (isExpanded: boolean) => void
    children?: React.ReactNode
}

export function FilterViewOption(props: FilterViewOptionProps) {
    const onExpanded = props.onExpanded
    const expanded = props.expanded || false

    const highContrastMode = useContext(ContrastState)

    return <div className={`group/filter_view`}>
        <div
            className={
                `p-2 min-h-16 w-full content-center cursor-pointer group-odd/filter_view:bg-black/80 group-even/filter_view:bg-black/70`
            }
            onClick={() => {
                if(onExpanded) { onExpanded(!expanded) }
            }}
        >
            <div className={`${highContrastMode ? "text-white" : "text-basetext"} text-2xl font-[600] flex content-center`}>
                <div className={`h-12 w-12 p-1.5`}>
                    {expanded ? ARROW_DOWN : ARROW_RIGHT}
                </div>
                <div className={`h-full mt-auto mb-auto`}>{props.header}</div>
            </div>
        </div>
        <div
            className={`${expanded ? `min-h-12` : `hidden`} bg-white/30 p-2 max-h-72 overflow-y-scroll`}
        >
            {props.children}
        </div>
    </div>
}