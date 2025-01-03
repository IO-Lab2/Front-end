'use client'

import {FilterCheckbox, FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {
    fetchGetOrganizationsFilter, fetchPublishers,
    fetchMinisterialScoresRange,
    fetchPublicationCountRange, fetchSearch,
    Organization, Scientist, SearchResponse, fetchPositions, APIRange, fetchJournalTypes, fetchPublicationYears,
} from "@/lib/API";
import {useEffect, useMemo, useState} from "react";
import {SearchOptions} from "@/components/SearchOptions";
import {FilterState} from "@/lib/FilterState";
import {getCookies} from "cookies-next/client";
import {FilterRange} from "@/components/FilterViewRange";

class OrganizationData {
    constructor() {
    }

    universities: Organization[] = []
    cathedras: Organization[] = []
    institutes: Organization[] = []

    publicationCount: { min?: number, max?: number } = {}
    ministerialPoints: { min?: number, max?: number } = {}

    positions: string[] = []
    publishers: string[] = []

    publicationYears: number[] = []
    journalTypes: string[] = []
}

export default function ViewPage() {
    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [scientists, setScientists] = useState<Scientist[] | null>(null)
    const [hasFilters, setHasFilters] = useState<boolean>(false)

    const [totalScientistCount, setTotalScientistCount] = useState<number>(0)

    const perPageLimit = 25

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

            const fetchedUniversities: Organization[] = []
            const fetchedCathedras: Organization[] = []
            const fetchedInstitutes: Organization[] = []

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

            const publicationCountRange: APIRange = await fetchPublicationCountRange()
            const ministerialPointRange: APIRange = await fetchMinisterialScoresRange()

            const publishers: string[] = await fetchPublishers()
            const positions: string[] = await fetchPositions()
            const journalTypes: string[] = await fetchJournalTypes()
            const publicationYears: number[] = await fetchPublicationYears()

            fetchedUniversities.sort((left, right) => {
                return left.name.localeCompare(right.name)
            })
            fetchedCathedras.sort((left, right) => {
                return left.name.localeCompare(right.name)
            })
            fetchedInstitutes.sort((left, right) => {
                return left.name.localeCompare(right.name)
            })
            publishers.sort((left, right) => {
                return left.localeCompare(right)
            })
            positions.sort((left, right) => {
                return left.localeCompare(right)
            })
            journalTypes.sort((left, right) => {
                return left.localeCompare(right)
            })
            publicationYears.sort().reverse()

            const searchResponse: SearchResponse | null = await fetchSearch({
                journalTypes: journalTypes,
                organizations: filters.getAllOrganizationNames(),
                limit: perPageLimit,
                ministerialScoreMax: ministerialPointRange.largest,
                ministerialScoreMin: ministerialPointRange.smallest,
                publicationsMax: publicationCountRange.largest,
                publicationsMin: publicationCountRange.smallest,
                publicationYears: publicationYears,
                publishers: publishers,
                positions: positions
            })

            const fetchedOrgData = new OrganizationData()
            fetchedOrgData.universities = fetchedUniversities
            fetchedOrgData.cathedras = fetchedCathedras
            fetchedOrgData.institutes = fetchedInstitutes
            fetchedOrgData.journalTypes = journalTypes
            fetchedOrgData.ministerialPoints.max = ministerialPointRange.largest
            fetchedOrgData.ministerialPoints.min = ministerialPointRange.smallest
            fetchedOrgData.publicationCount.max = publicationCountRange.largest
            fetchedOrgData.publicationCount.min = publicationCountRange.smallest
            fetchedOrgData.publicationYears = publicationYears
            fetchedOrgData.publishers = publishers
            fetchedOrgData.positions = positions

            setOrgData(fetchedOrgData)
            setScientists(searchResponse?.scientists ?? [])
            setTotalScientistCount(searchResponse?.count ?? 0)
        })()
    }, [filters])

    const universityCheckboxes = orgData?.universities.map((uni) => {
        return <FilterCheckbox
            key={uni.id}
            label={uni.name}
            count={0}
            isChecked={() => filters.universities.has(uni.name)}
            onChoice={(isChecked) => {
                if (isChecked) {
                    filters.universities.add(uni.name)
                    console.log(`Added university filter: ${uni.name}`)
                } else {
                    filters.universities.delete(uni.name)
                    console.log(`Removed university filter: ${uni.name}`)
                }

                filters.syncUniversityCookie()
                if (!hasFilters) {
                }
            }}
        />
    }) ?? []

    const instituteCheckboxes = orgData?.institutes.map((institute) => {
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
                if (!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    }) ?? []

    const cathedraCheckboxes = orgData?.cathedras.map((cathedra, index) => {
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
                if (!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    }) ?? []

    const positionCheckboxes = orgData?.positions.map((position) => {
        return <FilterCheckbox
            key={position}
            label={position}
            count={0}
            isChecked={() => filters.positions.has(decodeURI(position)) }
            onChoice={(isChecked) => {
                if(isChecked) {
                    filters.positions.add(position)
                    console.log(`Added position filter: ${position}`)
                } else {
                    filters.positions.delete(position)
                    console.log(`Removed position filter: ${position}`)
                }

                filters.syncPositionCookie()
                if(!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    }) ?? []

    const publicationCountRange = <FilterRange
        min={filters.publicationCount.min ?? 0}
        max={filters.publicationCount.max ?? 0}
        onChange={(min, max) => {
            filters.publicationCount.min = min || undefined
            filters.publicationCount.max = max || undefined

            filters.syncPublicationCountCookie()
            if (!hasFilters) {
                setHasFilters(true)
            }
        }}
    />

    const ministerialPointRange = <FilterRange
        min={filters.ministerialPoints.min ?? 0}
        max={filters.ministerialPoints.max ?? 0}
        onChange={(min, max) => {
            filters.ministerialPoints.min = min || undefined
            filters.ministerialPoints.max = max || undefined

            filters.syncMinisterialPointsCookie()
            if (!hasFilters) {
                setHasFilters(true)
            }
        }}
    />

    const publishersCheckboxes = orgData?.publishers.map((publisher) => {
        return <FilterCheckbox
            key={publisher}
            label={publisher}
            count={0}
            isChecked={() => filters.publishers.has(decodeURI(publisher)) }
            onChoice={(isChecked) => {
                if(isChecked) {
                    filters.publishers.add(publisher)
                    console.log(`Added publisher filter: ${publisher}`)
                } else {
                    filters.publishers.delete(publisher)
                    console.log(`Removed publisher filter: ${publisher}`)
                }

                filters.syncPublisherCookie()
                if(!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    }) ?? []

    const journalTypeCheckboxes = orgData?.journalTypes.map((journalType) => {
        return <FilterCheckbox
            key={journalType}
            label={journalType}
            count={0}
            isChecked={() => filters.publicationTypes.has(decodeURI(journalType)) }
            onChoice={(isChecked) => {
                if(isChecked) {
                    filters.publicationTypes.add(journalType)
                    console.log(`Added publication type filter: ${journalType}`)
                } else {
                    filters.publicationTypes.delete(journalType)
                    console.log(`Removed publication type filter: ${journalType}`)
                }

                filters.syncPublicationTypeCookie()
                if(!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    })

    // Shouldn't these be just a range?
    const publicationYearCheckboxes = orgData?.publicationYears.map((year) => {
        return <FilterCheckbox
            key={year}
            label={year.toString()}
            count={0}
            isChecked={() => filters.publicationYears.has(year) }
            onChoice={(isChecked) => {
                if(isChecked) {
                    filters.publicationYears.add(year)
                    console.log(`Added publication year filter: ${year}`)
                } else {
                    filters.publicationYears.delete(year)
                    console.log(`Removed publication year filter: ${year}`)
                }

                filters.syncPublicationYearCookie()
                if(!hasFilters) {
                    setHasFilters(true)
                }
            }}
        />
    })

    const scientistCells = (scientists ?? [])
        .map((scientist) => {
            return <ScientistCell
                key={scientist.id}
                title={scientist.academic_title}
                name={`${scientist.first_name} ${scientist.last_name}`}
                researchArea={scientist.research_areas?.map(area => area.name).join(", ") ?? ""}
                institute={"NYI (Institute)"}
                cathedra={"NYI (Cathedra)"}
            />
        })

    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Uczelnia">{universityCheckboxes}</FilterViewOption>
            <FilterViewOption header="Instytut">{instituteCheckboxes}</FilterViewOption>
            <FilterViewOption header="Katedra">{cathedraCheckboxes}</FilterViewOption>
            <FilterViewOption header="Stanowisko">{positionCheckboxes}</FilterViewOption>
            <FilterViewOption header="Ilość Publikacji">{publicationCountRange}</FilterViewOption>
            <FilterViewOption header="Ilość Punktów Ministerialnych">{ministerialPointRange}</FilterViewOption>
            <FilterViewOption header="Współczynnik IF"/>
            <FilterViewOption header="Wydawca">{publishersCheckboxes}</FilterViewOption>
            <FilterViewOption header="Lata Wydawania Publikacji">{publicationYearCheckboxes}</FilterViewOption>
            <FilterViewOption header="Rodzaj Publikacji">{journalTypeCheckboxes}</FilterViewOption>

            <div className={`bg-black/80 w-full flex-1`}></div>
        </div>
        <div className={`flex-1`}>
            <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                <p className={`text-3xl font-[600]`}>Znaleziono {totalScientistCount} wyników wyszukiwania</p>
                <SearchOptions
                    onRefresh={async () => {
                        setScientists([])
                        setTotalScientistCount(0)

                        const result: SearchResponse | null = await fetchSearch({
                            journalTypes: filters.publicationTypes.values().toArray(),
                            organizations: filters.getAllOrganizationNames(),
                            limit: perPageLimit,
                            ministerialScoreMax: filters.ministerialPoints.max ?? undefined,
                            ministerialScoreMin: filters.ministerialPoints.min ?? undefined,
                            publicationsMin: filters.publicationCount.min ?? undefined,
                            publicationsMax: filters.publicationCount.max ?? undefined,
                            publicationYears: filters.publicationYears.values().toArray(),
                            publishers: filters.publishers.values().toArray(),
                            positions: filters.positions.values().toArray()
                        })

                        if (result) {
                            setScientists(result.scientists ?? [])
                            setTotalScientistCount(result.count ?? 0)
                        }
                    }}
                    canResetFilters={hasFilters}
                    onFilterReset={() => {
                        filters.resetFilters()
                        setHasFilters(false)
                    }}
                />
            </div>
            {scientistCells}
        </div>
    </div>
}