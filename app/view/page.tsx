'use client'

import {FilterCheckbox, FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {fetchGetOrganizationsFilter, OrganizationBody} from "@/lib/API";
import {useEffect, useState} from "react";
import {FilterState} from "@/lib/FilterState";

export default function ViewPage() {
    const [universities, setUniversities] = useState<OrganizationBody[] | null>(null)
    const [cathedras, setCathedras] = useState<OrganizationBody[] | null>(null)
    const [institutes, setInstitutes] = useState<OrganizationBody[] | null>(null)

    useEffect(() => {
        (async function () {
            const allOrganizations = await fetchGetOrganizationsFilter() ?? []

            const fetchedUniversities: OrganizationBody[] = []
            const fetchedCathedras: OrganizationBody[] = []
            const fetchedInstitutes: OrganizationBody[] = []

            for(const org of allOrganizations) {
                switch(org.type.toLowerCase()) {
                    case "cathedra":
                        fetchedCathedras.push(org)
                        break
                    case "university":
                        fetchedUniversities.push(org)
                        break
                    case "institute":
                        fetchedInstitutes.push(org)
                        break
                }
            }

            setUniversities(fetchedUniversities)
            setCathedras(fetchedCathedras)
            setInstitutes(fetchedInstitutes)
        })()
    }, [])

    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Uczelnia">
                {
                    universities?.map((uni ) => {
                        return <FilterCheckbox
                            key={uni.id}
                            label={uni.name}
                            count={0}
                            onChoice={(isChecked: boolean) => {
                                if(isChecked) {
                                    FilterState.universityFilters.add(uni.id)
                                    console.log(`Added university filter: ${uni.id}`)
                                } else {
                                    FilterState.universityFilters.delete(uni.id)
                                    console.log(`Removed university filter: ${uni.id}`)
                                }
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Instytut">
                {
                    institutes?.map((institute) => {
                        return <FilterCheckbox
                            key={institute.id}
                            label={institute.name}
                            count={0}
                            onChoice={(isChecked: boolean) => {
                                if(isChecked) {
                                    FilterState.instituteFilters.add(institute.id)
                                    console.log(`Added institute filter: ${institute.id}`)
                                } else {
                                    FilterState.instituteFilters.delete(institute.id)
                                    console.log(`Removed institute filter: ${institute.id}`)
                                }
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Katedra">
                {
                    cathedras?.map((cathedra, index) => {
                        return <FilterCheckbox key={index} label={cathedra.name} count={0}/>
                    }) ?? []
                }
            </FilterViewOption>
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