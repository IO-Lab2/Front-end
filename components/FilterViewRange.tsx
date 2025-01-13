'use client'

export interface FilterRangeProps {
    min?: number,
    max?: number,
    defaultMin?: number,
    defaultMax?: number,
    onChange?: (min?: number, max?: number) => void
}

export function FilterRange(props: FilterRangeProps) {
    const onChange = props.onChange

    const min = props.min ? Math.max(props.min, props.defaultMin ?? Number.NEGATIVE_INFINITY) : undefined
    const max = props.max ? Math.min(props.max, props.defaultMax ?? Number.POSITIVE_INFINITY) : undefined

    return <>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Min:</div>
            <input
                className={`align-middle p-1 rounded-xl min-w-64`}
                type="number"
                value={min ?? ""}
                onChange={
                    (value) => {
                        const newMin = Number(value.target.value)
                        if(!isNaN(newMin) && onChange) { onChange(newMin, max) }
                    }
                }

                placeholder={props.defaultMin?.toString()}
                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`bg-black/80 rounded-xl text-basetext ml-2 p-1 align-middle`}
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
                className={`align-middle p-1 rounded-xl min-w-64`}
                type="number"
                value={max ?? ""}
                onChange={
                    (value) => {
                        const newMax = Number(value.target.value)
                        if (!isNaN(newMax) && onChange) { onChange(min, newMax) }
                    }
                }

                placeholder={props.defaultMax?.toString()}
                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`bg-black/80 rounded-xl text-basetext ml-2 p-1 align-middle`}
                onClick={() => {
                    if(onChange) { onChange(min, undefined) }
                }}
            >
                Reset
            </button>
        </div>
    </>
}