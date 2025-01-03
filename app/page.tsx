'use client'

// FIXME: Layout breaks on small displays, fonts and contents need to be resized and probably a min-size needs to be set

import FilterHeaderTable from "@/components/FilterHeaderTable";
import SkipFilterButton from "@/components/SkipFilterButton";
import {JSX, useState} from "react";
import {useRouter} from "next/navigation";
import {setCookie} from "cookies-next/client";
import {FilterState} from "@/lib/FilterState";
import {UUID} from "node:crypto";
import {Organization} from "@/lib/API";

export default function Home() {
    const router = useRouter()
    const [universityChoice, setUniversityChoice] = useState<UUID | null>(null);

    let pageContents: JSX.Element

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
                        Twoje centrum wiedzy akademickiej - znajdź publikacje, profesorów i badania w jednym
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
                    setUniversityChoice(org.id)
                }}
            />
        </>
    } else {
        pageContents = <>
            <FilterHeaderTable
                header={`Wybierz Instytut:`}
                parentOrg={universityChoice ?? undefined}
                onChoice={(org: Organization) => {
                    console.log(`Wybrano instytut: ${org.name}`)
                    setCookie(FilterState.COOKIE_INSTITUTES, JSON.stringify([org.name]), {
                        sameSite: "strict"
                    })
                    router.push("/view")
                }}
            />
        </>
    }

    return (
        <div className={`w-4/6 h-fit m-auto`}>
            <div className={`mt-10 mb-10`}>
                {pageContents}
                <SkipFilterButton onClick={() => {
                    router.push("/view")
                }} />
            </div>
        </div>
    );
}
