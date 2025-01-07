'use client'

import {useRouter, useSearchParams,} from "next/navigation";
import {useMemo, useState} from "react";
import {fetchScientistInfo, Scientist} from "@/lib/API";

export default function ScientistPage() {
    const searchParams = useSearchParams()
    const scientistID: string | null = searchParams.get("id")
    const router = useRouter();

    const [scientist, setScientist] = useState<Scientist | null | undefined>(undefined)

    useMemo(() => {
        if(scientistID !== null) {
            fetchScientistInfo(scientistID)
                .then((newScientist) => { setScientist(newScientist) })
        } else {
            setScientist(null)
        }
    }, [scientistID])

    if(!scientist) { return <></> } // FIXME display something when loading

    const emailLabel =
        scientist.email
            ? <a className={`underline`} href={`mailto:${scientist.email}`}>{scientist.email}</a>
            : <span>brak</span>

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
                    className={`p-2 h-20 bg-black/80 rounded-2xl text-center content-center text-basetext font-bold cursor-pointer`}
                    onClick={() => { router.replace("/view") }}
                >
                    &lt; Wróć
                </div>
                <form action={scientist.profile_url} target="_blank">
                    <input
                        className={`p-2 h-20 w-full bg-black/80 rounded-2xl text-center content-center text-basetext font-bold text-wrap cursor-pointer`}
                        type="submit"
                        value="Profil w bazie uczelni"
                    />
                </form>
                <div
                    className={`p-2 h-20 bg-black/80 rounded-2xl text-center content-center text-basetext font-bold cursor-pointer`}
                >
                    Dodaj do porównania &gt;
                </div>
            </div>
        </div>
        <div className={`p-6 m-6 h-72 bg-white/50 flex rounded-2xl text-2xl text-gray-800/80 font-semibold`}>
            <div className={`flex-1 flex flex-col`}>
                <p className={`flex-1`}>
                    <span>Punkty ministerialne:</span>
                    &nbsp;
                    <span>{scientist.bibliometrics.ministerial_score ?? 0}</span>
                </p>
                <p className={`flex-1`}>
                    <span>h-index WoS:</span>
                    &nbsp;
                    <span>{scientist.bibliometrics.h_index_wos}</span>
                </p>
                <p className={`flex-1`}>
                    <span>h-index Scopus:</span>
                    &nbsp;
                    <span>{scientist.bibliometrics.h_index_scopus}</span>
                </p>
            </div>
            <div className={`flex-1`}>
                <p className={`mb-2`}>Dyscypliny:</p>
            </div>
        </div>
    </div>
}