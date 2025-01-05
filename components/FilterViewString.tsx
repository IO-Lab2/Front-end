'use client'

import {useReducer} from "react";

export interface FilterStringProps {
    label: string,
    value?: () => string,
    onChanged?: (value: string) => void
}

export function FilterString(props: FilterStringProps) {
    const onChanged = props.onChanged
    const fieldText = props.value ? props.value() : ""

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    return <div className={`font-[600] p-1 flex gap-2`}>
        <input
            className={`align-middle p-1 rounded-xl flex-1`}
            type="text"
            placeholder={props.label}
            value={fieldText}
            onChange={
                (value) => {
                    if (onChanged) { onChanged(value.target.value) }
                    forceUpdate()
                }
            }
        />
        <button
            className={`bg-black/80 rounded-xl text-basetext text-xl font-mono w-6`}
            hidden={fieldText.length == 0}
            onClick={() => {
                if(onChanged) { onChanged("") }
                forceUpdate()
            }}
        >
            x
        </button>
    </div>
}