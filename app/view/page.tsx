'use client'

import {FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";

export default function ViewPage() {
    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-96 flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Uczelnia"/>
            <FilterViewOption header="Instytut"/>
            <FilterViewOption header="Katedra"/>
            <FilterViewOption header="Stanowisko"/>
            <FilterViewOption header="Ilość Publikacji"/>
            <FilterViewOption header="Ilość Punktów Ministerialnych"/>
            <FilterViewOption header="Współczynnik IF"/>
            <FilterViewOption header="Wydawca"/>
            <FilterViewOption header="Lata Wydawania Publikacji"/>
            <FilterViewOption header="Rodzaj Publikacji"/>

            <div className={`bg-black/80 w-full flex-1`}></div>
        </div>
        <div className={`flex-1`}>
            <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                <p className={`text-3xl font-[600]`}>Znaleziono 0 wyników wyszukiwania</p>
                <div className={`flex gap-6`}>
                    <div className={
                        `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
                    }>
                        Odśwież Wyniki
                    </div>
                    <div className={
                        `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
                    }>
                        Sortuj Według:
                    </div>
                </div>
            </div>
            <ScientistCell/>
            <ScientistCell/>
            <ScientistCell/>
            <ScientistCell/>
        </div>
    </div>
}