'use client'

import {useState} from "react";

export interface FilterRangeProps {
    min: number
    max: number,
    onChange?: (min: number, max: number) => void
}

export function FilterRange(props: FilterRangeProps) {
    const onChange = props.onChange

    const [min, setMin] = useState(props.min)
    const [max, setMax] = useState(props.max)

    return <>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Min:</div>
            <input
                className={`align-middle p-1 rounded-xl`}
                type="number"
                defaultValue={props.min}
                onChange={
                    (value) => {
                        const newMin = Number(value.target.value) || props.min
                        setMin(newMin)
                        if(onChange) { onChange(newMin, max) }
                        value.target.value = newMin.toString()
                    }
                }
                min={0}
            />
        </div>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Max:</div>
            <input
                className={`align-middle p-1 rounded-xl`}
                type="number"
                defaultValue={props.max}
                onChange={
                    (value) => {
                        const newMax = Number(value.target.value) || props.max
                        setMax(newMax)
                        if(onChange) { onChange(min, newMax) }
                        value.target.value = newMax.toString()
                    }
                }
                min={0}
            />
        </div>
    </>
}