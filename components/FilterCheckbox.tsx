'use client'

import React from "react";

export interface FilterCheckboxProps {
    label: string
    isChecked?: boolean,
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
                (value) => {
                    if (onChoice) {
                        onChoice(value.target.checked)
                    }
                }
            }/>
        <span className={`p-2 font-[600] align-middle`}>{props.label}</span>
    </div>
}