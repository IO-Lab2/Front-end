'use client'

import {useContext} from "react";
import {ContrastState} from "@/components/Toolbar";

export interface FilterStringProps {
    label: string,
    value?: string,
    onChanged?: (value: string) => void
}

export function FilterString(props: FilterStringProps) {
    const onChanged = props.onChanged
    const fieldText = props.value ?? ""
    const highContrastMode = useContext(ContrastState)

    return <div className={`font-[600] p-1 flex gap-2`}>
        <input
            className={`align-middle p-1 rounded-xl flex-1 ${highContrastMode ? "border border-black" : ""}`}
            type="text"
            placeholder={props.label}
            value={fieldText}
            onChange={
                (value) => {
                    if (onChanged) { onChanged(value.target.value) }
                }
            }
        />
        <button
            className={`${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext"} rounded-xl text-xl font-mono w-6`}
            hidden={fieldText.length == 0}
            onClick={() => {
                if(onChanged) { onChanged("") }
            }}
        >
            x
        </button>
    </div>
}