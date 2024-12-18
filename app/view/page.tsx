'use client'

import {FilterCheckbox, FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {
    fetchGetOrganizationsFilter,
    fetchMinisterialScoresRange,
    fetchPublicationCountRange, fetchSearch,
    OrganizationBody, Scientist
} from "@/lib/API";
import {useEffect, useMemo, useState} from "react";
import {SearchOptions} from "@/components/SearchOptions";
import {FilterState} from "@/lib/FilterState";
import {getCookies} from "cookies-next/client";
import {FilterRange} from "@/components/FilterViewRange";

class OrganizationData {
    constructor() { }

    universities: OrganizationBody[] = []
    cathedras: OrganizationBody[] = []
    institutes: OrganizationBody[] = []

    publicationCount: { min?: number, max?: number } = {}
    ministerialPoints: { min?: number, max?: number } = {}
}

export default function ViewPage() {
    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [scientists, setScientists] = useState<Scientist[] | null>(null)

    const filters = useMemo(() => {
        const state = new FilterState()
        // read filters from cookies on first load
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading filters from cookies...")
        console.log(state)
        return state
    }, [])

    useEffect(() => {
        (async function () {
            const allOrganizations = await fetchGetOrganizationsFilter() ?? []

            const fetchedUniversities: OrganizationBody[] = []
            const fetchedCathedras: OrganizationBody[] = []
            const fetchedInstitutes: OrganizationBody[] = []

            for (const org of allOrganizations) {
                switch (org.type.toLowerCase()) {
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

            const publicationCountRange = await fetchPublicationCountRange()
            const ministerialPointRange = await fetchMinisterialScoresRange()

            const scientists = await fetchSearch({
                organizations: filters.getAllOrganizationNames(),
                ministerialScoreMax: ministerialPointRange.largest,
                ministerialScoreMin: ministerialPointRange.smallest,
                publicationsMax: publicationCountRange.largest,
                publicationsMin: publicationCountRange.smallest,
            })

            const fetchedOrgData = new OrganizationData()
            fetchedOrgData.universities = fetchedUniversities
            fetchedOrgData.cathedras = fetchedCathedras
            fetchedOrgData.institutes = fetchedInstitutes
            fetchedOrgData.ministerialPoints.max = ministerialPointRange.largest
            fetchedOrgData.ministerialPoints.min = ministerialPointRange.smallest
            fetchedOrgData.publicationCount.max = publicationCountRange.largest
            fetchedOrgData.publicationCount.min = publicationCountRange.smallest

            setOrgData(fetchedOrgData)
            setScientists(scientists)
        })()
    }, [filters])

    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Uczelnia">
                {
                    orgData?.universities.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((uni) => {
                        return <FilterCheckbox
                            key={uni.id}
                            label={uni.name}
                            count={0}
                            isChecked={function() {
                                console.log(uni.name)
                                console.log(filters.universities)
                                return filters.universities.has(uni.name)
                            }}
                            onChoice={() => {
                                if(!filters.universities.has(uni.name)) {
                                    filters.universities.add(uni.name)
                                    console.log(`Added university filter: ${uni.name}`)
                                } else {
                                    filters.universities.delete(uni.name)
                                    console.log(`Removed university filter: ${uni.name}`)
                                }

                                filters.syncUniversityCookie()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Instytut">
                {
                    orgData?.institutes.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((institute) => {
                        return <FilterCheckbox
                            key={institute.id}
                            label={institute.name}
                            count={0}
                            isChecked={() => filters.institutes.has(decodeURI(institute.name))}
                            onChoice={(isChecked: boolean) => {
                                if (isChecked) {
                                    filters.institutes.add(institute.name)
                                    console.log(`Added institute filter: ${institute.name}`)
                                } else {
                                    filters.institutes.delete(institute.name)
                                    console.log(`Removed institute filter: ${institute.name}`)
                                }

                                filters.syncInstituteCookie()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Katedra">
                {
                    orgData?.cathedras.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((cathedra, index) => {
                        return <FilterCheckbox
                            key={index}
                            label={cathedra.name}
                            count={0}
                            isChecked={() => filters.cathedras.has(decodeURI(cathedra.name))}
                            onChoice={(isChecked: boolean) => {
                                if (isChecked) {
                                    filters.cathedras.add(cathedra.name)
                                    console.log(`Added cathedra filter: ${cathedra.name}`)
                                } else {
                                    filters.cathedras.delete(cathedra.name)
                                    console.log(`Removed cathedra filter: ${cathedra.name}`)
                                }

                                filters.syncCathedraCookie()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Stanowisko"/>
            <FilterViewOption header="Ilość Publikacji">
                <FilterRange
                    min={filters.publicationCount.min ?? 0}
                    max={filters.publicationCount.max ?? 0}
                    onChange={(min, max) => {
                        filters.publicationCount.min = min || undefined
                        filters.publicationCount.max = max || undefined

                        filters.syncPublicationCountCookie()
                    }}
                />
            </FilterViewOption>
            <FilterViewOption header="Ilość Punktów Ministerialnych">
                <FilterRange
                    min={filters.ministerialPoints.min ?? 0}
                    max={filters.ministerialPoints.max ?? 0}
                    onChange={(min, max) => {
                        filters.ministerialPoints.min = min || undefined
                        filters.ministerialPoints.max = max || undefined

                        filters.syncMinisterialPointsCookie()
                    }}
                />
            </FilterViewOption>
            <FilterViewOption header="Współczynnik IF"/>
            <FilterViewOption header="Wydawca"/>
            <FilterViewOption header="Lata Wydawania Publikacji"/>
            <FilterViewOption header="Rodzaj Publikacji"/>

            <div className={`bg-black/80 w-full flex-1`}></div>
        </div>
        <div className={`flex-1`}>
            <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                <p className={`text-3xl font-[600]`}>Znaleziono {scientists?.length ?? "..."} wyników wyszukiwania</p>
                <SearchOptions
                    onRefresh={async () => {
                        setScientists([])
                        const result = await fetchSearch({
                            organizations: filters.getAllOrganizationNames(),
                            ministerialScoreMax: filters.ministerialPoints.max ?? undefined,
                            ministerialScoreMin: filters.ministerialPoints.min ?? undefined,
                            publicationsMin: filters.publicationCount.min ?? undefined,
                            publicationsMax: filters.publicationCount.max ?? undefined
                        })

                        if(result) { setScientists(result) }
                    }}
                />
            </div>
            {
                (scientists ?? [])
                    .slice(0, 50) // Póki co limit 50 naukowców na stronę, aby nie wysadziło jej od ilości danych
                    .map((scientist) => {
                        return <ScientistCell
                            key={scientist.id}
                            title={scientist.academic_title}
                            name={`${scientist.first_name} ${scientist.last_name}`}
                            researchArea={scientist.research_areas?.map(area => area.name).join(", ") ?? ""}
                            institute={"NYI (Institute)"}
                            cathedra={"NYI (Cathedra)"}
                        />
                    }
                )
            }
        </div>
    </div>
}