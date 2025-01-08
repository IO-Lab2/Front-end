'use client'

export interface FilterRangeProps {
    min?: number,
    max?: number,
    defaultMin?: number,
    defaultMax?: number,
    onChange?: (min: number, max: number) => void
}

export function FilterRange(props: FilterRangeProps) {
    const onChange = props.onChange

    const min = props.min ?? props.defaultMin ?? 0
    const max = props.max ?? props.defaultMax ?? 0

    return <>
        <div className={`font-[600]`}>
            <div className={`inline-block w-14 p-2 align-middle`}>Min:</div>
            <input
                className={`align-middle p-1 rounded-xl min-w-64`}
                type="number"
                value={min}
                onChange={
                    (value) => {
                        const newMin = Number(value.target.value)
                        if(!isNaN(newMin) && onChange) { onChange(newMin, max) }
                    }
                }
                onBlur={(value) => {
                    const newMin = Number(value.target.value) || props.defaultMin || 0
                    if(onChange) { onChange(newMin, max) }
                }}

                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`bg-black/80 rounded-xl text-basetext ml-2 p-1 align-middle`}
                onClick={() => {
                    const newMin = props.defaultMin ?? 0
                    if(onChange) { onChange(newMin, max) }
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
                value={max}
                onChange={
                    (value) => {
                        const newMax = Number(value.target.value)
                        if (!isNaN(newMax) && onChange) { onChange(min, newMax) }
                    }
                }
                onBlur={(value) => {
                    const newMax = Number(value.target.value) || props.defaultMax || 0
                    if(onChange) { onChange(min, newMax) }
                }}

                min={props.defaultMin ?? 0}
                max={props.defaultMax}
            />
            <button
                className={`bg-black/80 rounded-xl text-basetext ml-2 p-1 align-middle`}
                onClick={() => {
                    const newMax = props.defaultMax ?? 0
                    if(onChange) { onChange(min, newMax) }
                }}
            >
                Reset
            </button>
        </div>
    </>
}