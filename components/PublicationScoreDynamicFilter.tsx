'use client'

import {YearScoreFilter} from "@/lib/API";
import {useState} from "react";

export interface PublicationScoreDynamicFilterProps {
    label?: string
    filters?: YearScoreFilter[]
    onAdded?: (filter: YearScoreFilter) => void
    onRemoved?: (filter: YearScoreFilter) => void
    onClear?: () => void
}

export default function PublicationScoreDynamicFilter(props: PublicationScoreDynamicFilterProps) {
    const currentFilters = props.filters || [];

    const currentYear = new Date().getFullYear()
    const [addFieldYear, setAddFieldYear] = useState<number>(currentYear)

    return <div>
        <p className={`font-semibold p-1 pl-2 pr-2 bg-black/80 rounded-t-2xl text-basetext`}>{props.label ?? " "}</p>
        <div className={
            `border-l-2 border-r-2 border-b-2 p-1 border-black/80 rounded-b-2xl font-semibold`
        }>
            <div className={`m-1 rounded-xl overflow-clip`}>
                {
                    currentFilters.map((filter) => {
                        return <div
                            className={`flex odd:bg-white/80 even:bg-white/40`}
                            key={filter.year}
                        >
                            <div className={`p-1 bg-black/80 text-basetext min-w-14 text-center`}>
                                {filter.year}
                            </div>

                            <div className={`flex-1 flex pl-1 pr-1`}>
                                <div className={`flex-1 flex`}>
                                    <span className={`p-1`}>Min:</span>
                                    <input
                                        className={`flex-1 w-full m-1 pl-1 pr-1`}
                                        type="number"
                                        min={0}
                                        value={filter.minScore?.toString() ?? ""}
                                        onChange={(value) => {
                                            if(props.onAdded) {
                                                const newMin = value.target.valueAsNumber || 0
                                                props.onAdded({
                                                    year: filter.year,
                                                    minScore: newMin,
                                                    maxScore: filter.maxScore
                                                })
                                            }
                                        }}
                                    />
                                </div>
                                <div className={`flex-1 flex`}>
                                    <span className={`p-1`}>Max:</span>
                                    <input
                                        className={`flex-1 w-full m-1 pl-1 pr-1`}
                                        type="number"
                                        min={0}
                                        value={filter.maxScore?.toString() ?? ""}
                                        onChange={(value) => {
                                            if(props.onAdded) {
                                                const newMax = value.target.valueAsNumber || 0
                                                props.onAdded({
                                                    year: filter.year,
                                                    minScore: filter.minScore,
                                                    maxScore: newMax
                                                })
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div
                                className={`bg-black/80 text-basetext content-center justify-center flex font-bold text-xl w-8 cursor-pointer`}
                                onClick={() => {
                                    if(props.onRemoved) { props.onRemoved(filter) }
                                }}
                            >
                                -
                            </div>
                        </div>
                    })
                }
            </div>

            <div className={`flex p-1`}>
                <div className={`flex-1`}></div>

                <div
                    className={`bg-black/80 text-basetext p-1 mr-2 content-center font-semibold rounded-xl text-center cursor-pointer`}
                    onClick={() => {
                        if(props.onClear) { props.onClear() }
                    }}
                >
                    Reset
                </div>

                <input
                    className={`bg-white rounded-l-xl w-20 pl-2 pr-2`}
                    type="number"
                    min={1970}
                    max={currentYear}
                    defaultValue={currentYear}
                    step={1}
                    placeholder="Rok"
                    onChange={(value) => {
                        setAddFieldYear(value.target.valueAsNumber || currentYear)
                    }}
                />

                <div
                    className={`bg-black/80 text-basetext w-8 text-xl font-bold rounded-r-xl content-center text-center cursor-pointer`}
                    onClick={() => {
                        if(addFieldYear && props.onAdded) {
                            props.onAdded(
                                {
                                    year: addFieldYear,
                                    minScore: 0,
                                    maxScore: 0
                                }
                            )
                        }
                    }}
                >
                    +
                </div>
            </div>
        </div>
    </div>
}