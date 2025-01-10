'use client'

import {CompareState} from "@/lib/CompareState";
import {getCookies} from "cookies-next/client";
import {useEffect, useMemo, useState} from "react";
import {
    fetchOrganizationsByScientistID,
    fetchPublicationsByScientistID,
    fetchScientistInfo,
    Organization,
    Scientist
} from "@/lib/API";
import ScientistCompareCard from "@/components/ScientistCompareCard";
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