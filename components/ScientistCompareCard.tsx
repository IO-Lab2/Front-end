'use client'

import {Organization, Scientist} from "@/lib/API";
import Link from "next/link";

export interface ScientistMinMax {
    min?: number,
    max?: number
}

export interface ScientistCompareCardProps {
    scientist: Scientist,
    organizations?: Organization[],
    ifScore?: number,

    ministerialRange?: ScientistMinMax,
    ifScoreRange?: ScientistMinMax,
    publicationCountRange?: ScientistMinMax,
    hIndexWosRange?: ScientistMinMax,
    hIndexScoreRange?: ScientistMinMax,
}

export default function ScientistCompareCard(props: ScientistCompareCardProps) {
    const organizations = props.organizations ?? []

    const highestHighlight = `pl-2 pr-2 bg-green-600 text-white rounded-xl`
    const lowestHighlight = `pl-2 pr-2 bg-red-600 text-white rounded-xl`

    const ministerialRange = props.ministerialRange ?? {}
    const ifScoreRange = props.ifScoreRange ?? {}
    const publicationCountRange = props.publicationCountRange ?? {}
    const hIndexWosRange = props.hIndexWosRange ?? {}
    const hIndexScoreRange = props.hIndexScoreRange ?? {}

    function highlight(range: ScientistMinMax, value: number | undefined): string {
        if((value ?? 0) <= (range.min ?? 0)) {
            return lowestHighlight
        } else if((value ?? 0) >= (range.max ?? 0)) {
            return highestHighlight
        } else {
            return ""
        }
    }

    return <div className={`flex-1 basis-1/3 box-context p-2`}>
        <div className={`p-4 bg-black/80 rounded-t-xl text-3xl`}>
            <p className={`font-semibold`}>
                <Link href={`/scientist?id=${props.scientist.id}`}>
                    <span className={`text-basetext`}>
                        {props.scientist.academic_title}
                    </span>
                    &nbsp;
                    <span className={`text-white`}>
                        {props.scientist.first_name} {props.scientist.last_name}
                    </span>
                </Link>
            </p>
            <p className={`text-basetext opacity-70 text-xl`}>
                <span>{props.scientist.position}</span>
                {props.scientist.position ? <span className={`ml-2 mr-2`}>&#8226;</span> : null}
                <span>ID: {props.scientist.id}</span>
            </p>
        </div>
        <div className={`pl-4 pr-4 pt-2 pb-2 text-lg text-bluetext bg-white/40 underline font-semibold`}>
            {
                organizations
                    .sort((left, right) => {
                        const lValue = orgOrderValue(left.type)
                        const rValue = orgOrderValue(right.type)
                        return lValue - rValue
                    })
                    .map(org => { return <p key={org.id}>&#8226; {org.name}</p> })
            }
        </div>
        <div className={`p-4 text-lg text-bluetext bg-white/70 font-semibold rounded-b-2xl flex`}>
            <div className={`flex-1`}>
                <p>Punkty ministerialne:</p>
                <p>Współczynnik IF:</p>
                <p>Liczba Publikacji:</p>
                <p>h-index WoS:</p>
                <p>h-index Scopus:</p>
            </div>
            <div className={`flex-row-reverse text-right min-w-12`}>
                <p
                    className={highlight(ministerialRange, props.scientist.bibliometrics.ministerial_score)}
                >
                    {props.scientist.bibliometrics.ministerial_score ?? 0}
                </p>
                <p
                    className={highlight(ifScoreRange, props.ifScore)}
                >
                    {(props.ifScore ?? 0).toFixed(1)}
                </p>
                <p
                    className={highlight(publicationCountRange, props.scientist.bibliometrics.publication_count)}
                >
                    {props.scientist.bibliometrics.publication_count ?? 0}
                </p>
                <p
                    className={highlight(hIndexWosRange, props.scientist.bibliometrics.h_index_wos)}
                >
                    {props.scientist.bibliometrics.h_index_wos}
                </p>
                <p
                    className={highlight(hIndexScoreRange, props.scientist.bibliometrics.h_index_scopus)}
                >
                    {props.scientist.bibliometrics.h_index_scopus}
                </p>
            </div>
        </div>
    </div>
}

function orgOrderValue(org: string): number {
    switch(org) {
        case "university":
            return 1
        case "institute":
            return 2
        case "cathedra":
            return 3
        default:
            return 4
    }
}