'use client'

import {fetchSearch} from "@/lib/API";

export function SearchOptions() {
    return (
        <div className={`flex gap-6`}>
            <div
                className={
                    `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
                }
                onClick={async () => {
                    // TEMP: For testing the API
                    const results = await fetchSearch({
                        name: "Adrian",
                        surname: "Bilski"
                    })
                    console.log(results)
                }}
            >
                Odśwież Wyniki
            </div>
            <div className={
                `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
            }>
                Sortuj Według:
            </div>
        </div>
    )
}

