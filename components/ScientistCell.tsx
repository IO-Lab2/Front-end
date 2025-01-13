'use client'

import {useContext, useMemo} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {Scientist} from "@/lib/API";
import {ContrastState} from "@/components/Toolbar";
import {ACCOUNT_BOX_ICON} from "@/components/Icons";

export interface ScientistCellProps {
    scientist: Scientist,
    selectedForComparison?: boolean
    onSelectForComparison?: (select: boolean) => void
}

export function ScientistCell(props: ScientistCellProps) {
    const router = useRouter();

    const propSpans = useMemo(() => {
        const researchAreas = props.scientist.research_areas ?? []
        return researchAreas.map((area, index) => {
            const name = area.name
            const suffix = index != 0 ? ", " : ""
            return <span key={name} className={`capitalize`}>{suffix}{name}</span>
        })
    }, [props.scientist])

    const highContrastMode = useContext(ContrastState)

    const selectedForComparison = props.selectedForComparison || false
    const onSelectForComparison = props.onSelectForComparison

    return (
        <div className={`p-12 w-full h-72 even:bg-white/30 flex gap-4 ${highContrastMode ? "border-2 border-black": ""}`}>
            <div className={`w-60 flex-shrink-0 flex content-center justify-center`}>
                <div
                    className={`m-auto h-full aspect-square cursor-pointer`}
                    onClick={() => { openScientistPage(router, props.scientist.id, highContrastMode) }}
                >
                    {ACCOUNT_BOX_ICON}
                </div>
            </div>
            <div className={`flex-1 flex flex-col font-[600]`}>
                <div className={`w-full flex-1 flex flex-col gap-1`} >
                    <p
                        className={`text-2xl hover:underline hover:cursor-pointer`}
                        onClick={() => { openScientistPage(router, props.scientist.id, highContrastMode) }}
                    >
                        <span className={`text-gray-800/80`}>{props.scientist.academic_title}</span> <span className={`text-3xl`}>{props.scientist.first_name} {props.scientist.last_name}</span>
                    </p>
                    <p className={`text-xl text-gray-800/80`}>
                        {propSpans}
                    </p>
                </div>
                <div className={`w-full flex-1 flex flex-col place-content-end gap-0.5`}>
                    <p className={`text-base w-fit underline ${highContrastMode ? "text-black" : "text-bluetext"}`}>
                        Publikacje: {props.scientist.bibliometrics.publication_count ?? 0}
                    </p>
                    <p className={`text-base w-fit underline ${highContrastMode ? "text-black" : "text-bluetext"}`}>
                        Punkty Ministerialne: {props.scientist.bibliometrics.ministerial_score ?? 0}
                    </p>
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

function openScientistPage(router: AppRouterInstance, id: string, highContrastMode: boolean) {
    const query = new URLSearchParams()
    query.set("id", id)
    if(highContrastMode) {
        query.set("highContrast", "1")
    }

    router.replace("/scientist?" + query.toString())
}