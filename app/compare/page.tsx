'use client'

import {CompareState} from "@/lib/CompareState";
import {getCookies} from "cookies-next/client";
import {useEffect, useMemo, useRef, useState} from "react";
import {
    fetchOrganizationsByScientistID,
    fetchPublicationsByScientistID,
    fetchScientistInfo,
    Organization,
    Scientist
} from "@/lib/API";
import ScientistCompareCard, {ScientistMinMax} from "@/components/ScientistCompareCard";
import {useRouter} from "next/navigation";

interface ScientistOrgs {
    [key: string]: Organization[]
}
interface ScientistIFScores {
    [key: string]: number
}


export default function ComparePage() {
    const router = useRouter();
    const compareInfo = useMemo(() => {
        const state = new CompareState()
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading comparison info from cookies...")

        return state
    }, [])

    const [scientists, setScientists] = useState<Scientist[] | null>(null)
    const [orgs, setOrgs] = useState<ScientistOrgs>({})
    const [ifScores, setIfScores] = useState<ScientistIFScores>({})

    const ministerial = useRef<ScientistMinMax>({})
    const ifScore = useRef<ScientistMinMax>({})
    const publicationCount = useRef<ScientistMinMax>({})
    const hIndexWoS = useRef<ScientistMinMax>({})
    const hIndexScopus = useRef<ScientistMinMax>({})

    useEffect(() => {
        (async function() {
            const output: Scientist[] = []
            const outputOrgs: ScientistOrgs = {}
            const outputIFScores: ScientistIFScores = {}

            for(const scientist of compareInfo.scientists) {
                const id = decodeURI(scientist)

                console.log(id)

                const parsedScientist = await fetchScientistInfo(id)
                const parsedOrgs = await fetchOrganizationsByScientistID(id)
                const publications = await fetchPublicationsByScientistID(id)

                if(parsedScientist) {
                    output.push(parsedScientist)
                    outputOrgs[id] = parsedOrgs ?? []
                    outputIFScores[id] = (publications ?? []).reduce((total, next) => {
                        return total + next.impact_factor
                    }, 0)
                }
            }

            ministerial.current.max = output.reduce((prev, next) => {
                return (prev.bibliometrics.ministerial_score ?? 0) > (next.bibliometrics.ministerial_score ?? 0) ? prev : next
            }).bibliometrics.ministerial_score ?? 0

            ministerial.current.min = output.reduce((prev, next) => {
                return (prev.bibliometrics.ministerial_score ?? 0) < (next.bibliometrics.ministerial_score ?? 0) ? prev : next
            }).bibliometrics.ministerial_score ?? 0

            ifScore.current.max = output.reduce((max, next) => {
                const nextIfScore = outputIFScores[next.id] ?? 0
                return nextIfScore > max ? nextIfScore : max
            }, 0)
            ifScore.current.min = output.reduce((min, next) => {
                const nextIfScore = outputIFScores[next.id] ?? 0
                return nextIfScore < min ? nextIfScore : min
            }, 0)

            publicationCount.current.max = output.reduce((prev, next) => {
                return (prev.bibliometrics.publication_count ?? 0) > (next.bibliometrics.publication_count ?? 0) ? prev : next
            }).bibliometrics.publication_count ?? 0
            publicationCount.current.min = output.reduce((prev, next) => {
                return (prev.bibliometrics.publication_count ?? 0) < (next.bibliometrics.publication_count ?? 0) ? prev : next
            }).bibliometrics.publication_count ?? 0

            hIndexWoS.current.max = output.reduce((prev, next) => {
                return (prev.bibliometrics.h_index_wos ?? 0) > (next.bibliometrics.h_index_wos ?? 0) ? prev : next
            }).bibliometrics.h_index_wos ?? 0
            hIndexWoS.current.min = output.reduce((prev, next) => {
                return (prev.bibliometrics.h_index_wos ?? 0) < (next.bibliometrics.h_index_wos ?? 0) ? prev : next
            }).bibliometrics.h_index_wos ?? 0

            hIndexScopus.current.max = output.reduce((prev, next) => {
                return (prev.bibliometrics.h_index_scopus ?? 0) > (next.bibliometrics.h_index_scopus ?? 0) ? prev : next
            }).bibliometrics.h_index_scopus ?? 0
            hIndexScopus.current.min = output.reduce((prev, next) => {
                return (prev.bibliometrics.h_index_scopus ?? 0) < (next.bibliometrics.h_index_scopus ?? 0) ? prev : next
            }).bibliometrics.h_index_scopus ?? 0

            setScientists(output)
            setOrgs(outputOrgs)
            setIfScores(outputIFScores)
        })()
    }, [compareInfo])

    const scientistCards = (scientists ?? []).map((scientist) => {
        return <ScientistCompareCard
            key={scientist.id}
            scientist={scientist}
            organizations={orgs[scientist.id] ?? []}
            ifScore={ifScores[scientist.id] ?? 0}

            ministerialRange={ministerial.current}
            ifScoreRange={ifScore.current}
            publicationCountRange={publicationCount.current}
            hIndexWosRange={hIndexWoS.current}
            hIndexScoreRange={hIndexScopus.current}
        />
    })

    return <div className={`w-full h-full`}>
        <div className={`flex m-4 mb-0 text-2xl font-bold`}>
            <div className={`bg-white/60 p-4 text-black/80 rounded-l-2xl flex-1`}>
                Porównywanie {scientists?.length ?? 0} naukowców
            </div>
            <div
                className={`bg-black/80 p-4 rounded-r-2xl w-44 text-center text-basetext cursor-pointer`}
                onClick={() => router.replace("/view")}
            >
                {`<`} Powrót
            </div>
        </div>
        <div className={`flex p-2 flex-wrap`}>
            {scientistCards}
        </div>
    </div>
}