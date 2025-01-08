'use client'

import {useMemo} from "react";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ScientistCellProps {
    scientistID: string,
    title: string,
    name: string,
    researchAreas: Array<{ name: string }>,
    institute: string,
    cathedra: string,
    selectedForComparison?: boolean
    onSelectForComparison?: (select: boolean) => void
}

export function ScientistCell(props: ScientistCellProps) {
    const router = useRouter();
    const propSpans = useMemo(() => {
        return props.researchAreas.map((area, index) => {
            const name = area.name
            const suffix = index != 0 ? ", " : ""
            return <span key={name} className={`capitalize`}>{suffix}{name}</span>
        })
    }, [props.researchAreas])

    const selectedForComparison = props.selectedForComparison || false
    const onSelectForComparison = props.onSelectForComparison

    return (
        <div className="p-12 w-full h-72 even:bg-white/30 flex gap-4">
            <div className={`w-60 flex-shrink-0 flex content-center justify-center`}>
                <div
                    className={`bg-black m-auto h-full aspect-square cursor-pointer`}
                    onClick={() => { openScientistPage(router, props.scientistID) }}
                >

                </div>
            </div>
            <div className={`flex-1 flex flex-col font-[600]`}>
                <div className={`w-full flex-1 flex flex-col gap-1`}>
                    <p className={`text-2xl`}>
                        <span className={`text-gray-800/80`}>{props.title}</span> <span className={`text-3xl`}>{props.name}</span>
                    </p>
                    <p className={`text-xl text-gray-800/80`}>
                        {propSpans}
                    </p>
                </div>
                <div className={`w-full flex-1 flex flex-col place-content-end gap-2`}>
                    <p className={`text-xl w-fit underline text-bluetext cursor-pointer`}>{props.cathedra}</p>
                    <p className={`text-xl w-fit underline text-bluetext cursor-pointer`}>{props.institute}</p>
                </div>
            </div>
            <div className={`flex justify-center`}>
                <input
                    className={`align-middle m-auto size-10`}
                    type="checkbox"
                    checked={selectedForComparison}
                    onChange={
                        onSelectForComparison
                            ? (value) => onSelectForComparison(value.target.checked)
                            : undefined
                    }
                />
            </div>
        </div>
    )
}

function openScientistPage(router: AppRouterInstance, id: string) {
    const query = new URLSearchParams()
    query.set("id", id)

    router.replace("/scientist?" + query.toString())
}