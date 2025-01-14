'use client'

import {useRouter, useSearchParams,} from "next/navigation";
import {useEffect, useState} from "react";
import {fetchPublicationsByScientistID, fetchScientistInfo, Publication, Scientist} from "@/lib/API";
import PublicationTable from "@/components/PublicationTable";
import MinisterialScoreTable from "@/components/MinisterialScoreTable";
import Toolbar, {ContrastState} from "@/components/Toolbar";
import {ACCOUNT_BOX_ICON} from "@/components/Icons";

export default function ScientistPage() {
    const query = useSearchParams()
    const router = useRouter()

    const scientistID: string | null = query.get("id")

    const highContrastMode = query.has("highContrast")

    const [scientist, setScientist] = useState<Scientist | null | undefined>(undefined)
    const [publications, setPublications] = useState<Publication[]>([])

    useEffect(() => {
        if (scientistID !== null) {
            fetchScientistInfo(scientistID)
                .then((newScientist) => {
                    setScientist(newScientist)
                })
            fetchPublicationsByScientistID(scientistID)
                .then((publications) => {
                    setPublications(publications ?? [])
                })
        } else {
            setScientist(null)
        }
    }, [scientistID])

    if (!scientist) {
        return <></>
    } // FIXME display something when loading

    const emailLabel =
        scientist.email
            ? <a className={`underline`} href={`mailto:${scientist.email}`}>{scientist.email}</a>
            : <span>-</span>

    const totalImpactFactor = publications.reduce((total, next) => {
        return total + next.impact_factor
    }, 0)


    return <Toolbar
        highContrastMode={highContrastMode}
        onToggleContrast={
            () => {
                const queryCopy = new URLSearchParams(query)
                if(highContrastMode) {
                    queryCopy.delete("highContrast")
                } else {
                    queryCopy.append("highContrast", "1")
                }
                router.replace("/scientist?" + queryCopy.toString())
            }
        }
    >
        <div className={`w-full h-full`}>
            <div className={`p-12 w-full h-72 bg-white/50 flex gap-4`}>
                <div className={`w-60 flex-shrink-0 flex content-center justify-center`}>
                    <div className={`m-auto h-full aspect-square cursor-pointer`}>
                        {ACCOUNT_BOX_ICON}
                    </div>
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
                        <p className={`text-2xl ${highContrastMode ? "text-black" : "text-bluetext"}`}>
                            Email: {emailLabel}
                        </p>
                    </div>
                </div>
                <div className={`flex flex-col justify-center gap-6 w-60 text-lg`}>
                    <div
                        className={`p-2 h-20 bg-black/80 rounded-xl text-center content-center ${highContrastMode ? "text-white" : "text-basetext"} font-bold cursor-pointer`}
                        onClick={() => {
                            const contrast = highContrastMode ? "?highContrast=1" : ""
                            router.push("/view" + contrast)
                        }}
                    >
                        &lt; Wróć
                    </div>
                    <form action={scientist.profile_url} target="_blank">
                        <input
                            className={`p-2 h-20 w-full bg-black/80 rounded-xl text-center content-center ${highContrastMode ? "text-white" : "text-basetext"} font-bold text-wrap cursor-pointer`}
                            type="submit"
                            value="Profil w bazie uczelni"
                        />
                    </form>
                </div>
            </div>
            <div className={`flex flex-col gap-6 p-6 `}>
                <div
                    className={`p-6 pl-12 pr-12 bg-white/50 flex gap-12 rounded-2xl text-2xl font-semibold ${highContrastMode ? "border-2 border-black text-black" : "text-gray-800/80"}`}
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
                        <div
                            className={`mt-1 text-lg underline ${highContrastMode ? "text-black/80" : "text-bluetext"} capitalize`}>
                            {
                                (scientist.research_areas ?? [])
                                    .map((area, i) => {
                                        return <p key={i}>{area.name}</p>
                                    })
                            }
                        </div>
                    </div>
                </div>

                <ContrastState.Provider value={highContrastMode}>
                    <MinisterialScoreTable
                        scores={scientist.publication_scores ?? []}
                        total={scientist.bibliometrics.ministerial_score ?? 0}/>
                    <PublicationTable
                        publications={publications}/>
                </ContrastState.Provider>
            </div>
        </div>
    </Toolbar>
}