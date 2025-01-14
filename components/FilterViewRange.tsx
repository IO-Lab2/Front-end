'use client'

import {useContext} from "react";
import {ContrastState} from "@/components/Toolbar";

export interface FilterRangeProps {
    min?: number,
    max?: number,
    defaultMin?: number,
    defaultMax?: number,
    onChange?: (min?: number, max?: number) => void
}

export function FilterRange(props: FilterRangeProps) {
    const onChange = props.onChange
    const highContrastMode = useContext(ContrastState)

    const min = props.min ? Math.max(props.min, props.defaultMin ?? Number.NEGATIVE_INFINITY) : undefined
    const max = props.max ? Math.min(props.max, props.defaultMax ?? Number.POSITIVE_INFINITY) : undefined

    return <>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Min:</div>
            <input
                className={`${highContrastMode ? "border border-black" : ""} align-middle p-1 rounded-xl min-w-64`}
                type="number"
                value={min ?? ""}
                onChange={
                    (value) => {
                        const newMin = Number(value.target.value)
                        if(!isNaN(newMin) && onChange) { onChange(newMin, max) }
                    }
                }
                onBlur={() => {
                    if(min !== undefined && max !== undefined && min > max && onChange) {
                        onChange(max, max)
                    }
                }}

                placeholder={props.defaultMin?.toString()}
                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext "} rounded-xl ml-2 p-1 align-middle`}
                onClick={() => {
                    if(onChange) { onChange(undefined, max) }
                }}
            >
                Reset
            </button>
        </div>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Max:</div>
            <input
                className={`${highContrastMode ? "border border-black" : ""} align-middle p-1 rounded-xl min-w-64`}
                type="number"
                value={max ?? ""}
                onChange={
                    (value) => {
                        const newMax = Number(value.target.value)
                        if (!isNaN(newMax) && onChange) { onChange(min, newMax) }
                    }
                }
                onBlur={() => {
                    if(min !== undefined && max !== undefined && max < min && onChange) {
                        onChange(min, min)
                    }
                }}

                placeholder={props.defaultMax?.toString()}
                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext "} rounded-xl ml-2 p-1 align-middle`}
                onClick={() => {
                    if(onChange) { onChange(min, undefined) }
                }}
            >
                Reset
            </button>
        </div>
    </>
}