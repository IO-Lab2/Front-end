'use client'

export interface FilterRangeProps {
    min: number
    max: number
}

export function FilterRange(props: FilterRangeProps) {
    return <>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Min:</div>
            <input
                className={`align-middle p-1 rounded-xl`}
                type="number"
                defaultValue={props.min}
            />
        </div>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Max:</div>
            <input
                className={`align-middle p-1 rounded-xl`}
                type="number"
                defaultValue={props.max}
            />
        </div>
    </>
}