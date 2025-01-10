'use client'

import {Organization, Scientist} from "@/lib/API";

export interface ScientistCompareCardProps {
    scientist: Scientist,
    organizations?: Organization[],
}

export default function ScientistCompareCard(props: ScientistCompareCardProps) {
    const organizations = props.organizations ?? [];

    return <div className={`flex-1 basis-1/3 box-context p-2`}>
        <div className={`p-4 bg-black/80 rounded-t-xl text-3xl`}>
            <p className={`font-semibold`}>
                <span className={`text-basetext`}>
                    {props.scientist.academic_title}
                </span>
                &nbsp;
                <span className={`text-white`}>
                    {props.scientist.first_name} {props.scientist.last_name}
                </span>
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
            <div className={`flex-row-reverse text-right`}>
                <p>{props.scientist.bibliometrics.ministerial_score ?? 0}</p>
                <p>0</p>
                <p>{props.scientist.bibliometrics.publication_count ?? 0}</p>
                <p>{props.scientist.bibliometrics.h_index_wos}</p>
                <p>{props.scientist.bibliometrics.h_index_scopus}</p>
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