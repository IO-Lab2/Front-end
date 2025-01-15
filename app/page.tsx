'use client'

import FilterHeaderTable from "@/components/FilterHeaderTable";
import SkipFilterButton from "@/components/SkipFilterButton";
import {JSX, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {setCookie} from "cookies-next/client";
import {FilterState} from "@/lib/FilterState";
import {UUID} from "node:crypto";
import {Organization} from "@/lib/API";
import Toolbar, {ContrastState} from "@/components/Toolbar";

export default function Home() {
    const router = useRouter()
    const query = useSearchParams()

    const [universityChoice, setUniversityChoice] = useState<UUID | null>(null);

    // resets filters when entering main page
    useEffect(() => (new FilterState()).resetFilters(true), [])

    let pageContents: JSX.Element

    const highContrastMode = query.has("highContrast")

    if (universityChoice == null) {
        pageContents = <>
            <div className={`mb-5`}>
                <div>
                    <h1 className={`font-playfair font-extrabold text-black text-center text-8xl`}>
                        Akademicka Baza Wiedzy
                    </h1>
                </div>
                <div>
                    <h4 className={`font-playfair font-extrabold text-black text-center text-2xl`}>
                        Twoje centrum wiedzy akademickiej - znajdź publikacje, naukowców i badania w jednym
                        miejscu!
                    </h4>
                </div>
            </div>
            <FilterHeaderTable
                header={`Na początku wybierz uczelnię:`}
                onChoice={(org: Organization) => {
                    console.log(`Wybrano uniwersytet: ${org.name}`)
                    setCookie(FilterState.COOKIE_UNIVERSITIES, JSON.stringify([org.name]), {
                        sameSite: "strict"
                    })
                    setCookie(FilterState.COOKIE_EXTENDED_TABS, JSON.stringify([1]), {
                        sameSite: "strict"
                    })
                    setUniversityChoice(org.id)
                }}
            />
        </>
    } else {
        pageContents = <>
            <FilterHeaderTable
                header={`Wybierz organizację:`}
                parentOrg={universityChoice ?? undefined}
                onChoice={(org: Organization) => {
                    console.log(`Wybrano organizację: ${org.name}`)
                    setCookie(FilterState.COOKIE_INSTITUTES, JSON.stringify([org.name]), {
                        sameSite: "strict"
                    })
                    setCookie(FilterState.COOKIE_EXTENDED_TABS, JSON.stringify([2]), {
                        sameSite: "strict"
                    })

                    const contrast = highContrastMode ? "?highContrast=1" : ""
                    router.push("/view" + contrast)
                }}
            />
        </>
    }

    return (
        <Toolbar
            highContrastMode={highContrastMode}
            onToggleContrast={
                () => {
                    const queryCopy = new URLSearchParams(query)
                    if(highContrastMode) {
                        queryCopy.delete("highContrast")
                    } else {
                        queryCopy.append("highContrast", "1")
                    }
                    router.replace("?" + queryCopy.toString())
                }
            }
        >
            <div className={`w-4/6 h-fit m-auto`}>
                <div className={`mt-10 mb-10`}>
                    <ContrastState.Provider value={highContrastMode}>
                        {pageContents}
                        <SkipFilterButton onClick={() => {
                            const contrast = highContrastMode ? "?highContrast=1" : ""
                            router.push("/view" + contrast)
                        }}/>
                    </ContrastState.Provider>
                </div>
            </div>
        </Toolbar>
    );
}
