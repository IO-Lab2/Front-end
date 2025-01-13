'use client'

import {useRouter, useSearchParams,} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {fetchPublicationsByScientistID, fetchScientistInfo, Publication, Scientist} from "@/lib/API";
import PublicationTable from "@/components/PublicationTable";
import MinisterialScoreTable from "@/components/MinisterialScoreTable";
import {CompareState} from "@/lib/CompareState";
import {getCookies} from "cookies-next/client";

export default function ScientistPage() {
    const searchParams = useSearchParams()
    const scientistID: string | null = searchParams.get("id")
    const router = useRouter();

    const [scientist, setScientist] = useState<Scientist | null | undefined>(undefined)
    const [publications, setPublications] = useState<Publication[]>([])

    const compareInfo = useMemo(() => {
        const state = new CompareState()
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading comparison info from cookies...")

        return state
    }, [])

    useMemo(() => {
        if(scientistID !== null) {
            fetchScientistInfo(scientistID)
                .then((newScientist) => { setScientist(newScientist) })
            fetchPublicationsByScientistID(scientistID)
                .then((publications) => { setPublications(publications ?? [])})
        } else {
            setScientist(null)
        }
    }, [scientistID])

    const [isBeingCompared, setIsBeingCompared] = useState<boolean>(false)
    const disableCompare = compareInfo.scientists.size >= CompareState.LIMIT && !isBeingCompared

    useEffect(() => {
        setIsBeingCompared(scientist ? compareInfo.scientists.has(scientist.id) : false)
    }, [compareInfo, scientist])

    if(!scientist) { return <></> } // FIXME display something when loading

    const emailLabel =
        scientist.email
            ? <a className={`underline`} href={`mailto:${scientist.email}`}>{scientist.email}</a>
            : <span>-</span>

    const totalImpactFactor = publications.reduce((total, next) => {
        return total + next.impact_factor
    }, 0)


    return <div className={`w-full h-full`}>
        <div className={`p-12 w-full h-72 bg-white/50 flex gap-4`}>
            <div className={`w-60 flex-shrink-0 flex content-center justify-center`}>
                <div className={`bg-black m-auto h-full aspect-square cursor-pointer`}></div>
            </div>
            <div className={`flex-1 flex flex-col font-[600]`}>
                <div className={`w-full flex-1 flex flex-col gap-2`}>
                    <p className={`text-4xl`}>
                        <span className={`text-gray-800/80`}>{scientist.academic_title}</span>
                        &nbsp;
                        <span className={`text-5xl`}>{scientist.first_name} {scientist.last_name}</span>
                    </p>
                    <p className={`text-2xl text-gray-800/80`}>
                        <span>{scientist.position ?? ""}</span>
                        <span className={`ml-2 mr-2`}>&#8226;</span>
                        <span>ID: {scientist.id}</span>
                    </p>
                </div>
                <div className={`w-full flex-1 flex flex-col place-content-end gap-2`}>
                    <p className={`text-2xl text-bluetext`}>
                        Email: {emailLabel}
                    </p>
                </div>
            </div>
            <div className={`flex flex-col justify-center gap-6 w-60 text-lg`}>
                <div
                    className={`p-2 h-20 bg-black/80 rounded-xl text-center content-center text-basetext font-bold cursor-pointer`}
                    onClick={() => { router.replace("/view") }}
                >
                    &lt; Wróć
                </div>
                <form action={scientist.profile_url} target="_blank">
                    <input
                        className={`p-2 h-20 w-full bg-black/80 rounded-xl text-center content-center text-basetext font-bold text-wrap cursor-pointer`}
                        type="submit"
                        value="Profil w bazie uczelni"
                    />
                </form>
                <div
                    className={`p-2 h-20 bg-black/80 rounded-xl text-center content-center text-basetext font-bold ${disableCompare ? "cursor-default opacity-20" : "cursor-pointer"}`}
                    onClick={() => {
                        if(!disableCompare) {
                            if(isBeingCompared) {
                                if(compareInfo.remove(scientist.id)) {
                                    compareInfo.syncCookie()
                                    setIsBeingCompared(false)
                                }
                            } else {
                                if(compareInfo.add(scientist.id)) {
                                    compareInfo.syncCookie()
                                    setIsBeingCompared(true)
                                }
                            }
                        }
                    }}
                >
                    { isBeingCompared ? `Usuń z porównywania` : `Dodaj do porównywania` }
                </div>
            </div>
        </div>
        <div className={`flex flex-col gap-6 p-6`}>
            <div
                className={`p-6 pl-12 pr-12 bg-white/50 flex gap-12 rounded-2xl text-2xl text-gray-800/80 font-semibold`}
            >
                <div className={`flex-1 flex`}>
                    <div className={`flex-1`}>
                        <p>Punkty ministerialne:</p>
                        <p>Współczynnik Impact Factor:</p>
                        <p>h-index WoS:</p>
                        <p>h-index Scopus:</p>
                    </div>
                    <div className={`flex-1 text-right`}>
                        <p>{scientist.bibliometrics.ministerial_score ?? 0}</p>
                        <p>{totalImpactFactor.toFixed(1)}</p>
                        <p>{scientist.bibliometrics.h_index_wos ?? 0}</p>
                        <p>{scientist.bibliometrics.h_index_scopus ?? 0}</p>
                    </div>
                </div>
                <div className={`flex-1`}>
                    <p>Dyscypliny:</p>
                    <div className={`mt-1 text-lg underline text-bluetext capitalize`}>
                        {
                            (scientist.research_areas ?? [])
                                .map((area, i) => {
                                    return <p key={i}>{area.name}</p>
                                })
                        }
                    </div>
                </div>
            </div>

            <MinisterialScoreTable
                scores={scientist.publication_scores ?? []}
                total={scientist.bibliometrics.ministerial_score ?? 0}/>
            <PublicationTable
                publications={publications}/>
        </div>
    </div>
}