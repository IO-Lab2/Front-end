'use client'

import {FilterCheckbox, FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {
    fetchGetOrganizationsFilter, fetchPublishers,
    fetchMinisterialScoresRange,
    fetchPublicationCountRange,
    Organization, Scientist, SearchResponse, fetchPositions, APIRange, fetchJournalTypes, fetchPublicationYears,
} from "@/lib/API";
import {useEffect, useMemo, useRef, useState} from "react";
import {SearchOptions} from "@/components/SearchOptions";
import {FilterState} from "@/lib/FilterState";
import {getCookies} from "cookies-next/client";
import {FilterRange} from "@/components/FilterViewRange";
import {FilterString} from "@/components/FilterViewString";
import {CompareState} from "@/lib/CompareState";
import {useRouter} from "next/navigation";

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

    name?: string
    surname?: string
}

enum UsedOrganization {
    university,
    cathedra,
    institute
}

export default function ViewPage() {
    const perPageLimit = 25
    const router = useRouter()

    const filters = useMemo(() => {
        const state = new FilterState()
        // read filters from cookies on first load
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading filters from cookies...")

        return state
    }, [])

    const compareInfo = useMemo(() => {
        const state = new CompareState()
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading comparison info from cookies...")

        return state
    }, [])

    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [scientists, setScientists] = useState<Scientist[] | null>(null)
    const [hasFilters, setHasFilters] = useState<boolean>(filters.hasFilters())

    const initialUsedOrganization =
        filters.cathedras.size > 0
            ? UsedOrganization.cathedra
            : filters.institutes.size > 0
                ? UsedOrganization.institute
                : UsedOrganization.university

    const [usedOrg, setUsedOrg] = useState<UsedOrganization>(initialUsedOrganization)
    const [totalScientistCount, setTotalScientistCount] = useState<number | null>(null)

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number>(1)

    const [nameFilterChanged, setNameFilterChanged] = useState<boolean>(true)
    const [uniFilterChanged, setUniFilterChanged] = useState<boolean>(true)
    const [instituteFilterChanged, setInstituteFilterChanged] = useState<boolean>(true)
    const [cathedraFilterChanged, setCathedraFilterChanged] = useState<boolean>(true)
    const [positionFilterChanged, setPositionFilterChanged] = useState<boolean>(true)
    const [publicationCountFilterChanged, setPublicationCountFilterChanged] = useState<boolean>(true)
    const [ministerialPointFilterChanged, setMinisterialPointFilterChanged] = useState<boolean>(true)
    const [ifScoreFilterChanged, setIfScoreFilterChanged] = useState<boolean>(true)
    const [publishersFilterChanged, setPublishersFilterChanged] = useState<boolean>(true)
    const [journalFilterChanged, setJournalFilterChanged] = useState<boolean>(true)
    const [publicationYearFilterChanged, setPublicationYearFilterChanged] = useState<boolean>(true)
    const [scientistsChanged, setScientistsChanged] = useState<boolean>(true)

    // Only allows selecting a single organization type (unselects the rest)
    useMemo(() => {
        if(usedOrg != UsedOrganization.university) {
            filters.universities.clear()
            setUniFilterChanged(true)
            filters.syncUniversityCookie()
        }
        if(usedOrg != UsedOrganization.institute) {
            filters.institutes.clear()
            setInstituteFilterChanged(true)
            filters.syncInstituteCookie()
        }
        if(usedOrg != UsedOrganization.cathedra) {
            filters.cathedras.clear()
            setCathedraFilterChanged(true)
            filters.syncCathedraCookie()
        }
    }, [filters, usedOrg])

    useEffect(() => {
        (async function () {
            const fetchedOrgData = await fetchInitialOrganizationData()
            const searchResponse: SearchResponse | null = await filters.search(perPageLimit)

            const scientists = searchResponse?.scientists ?? []
            const scientistCount = searchResponse?.count ?? 0

            const pageCount = Math.ceil(scientistCount / perPageLimit)
            const selectedPage = pageCount == 0 ? 0 : 1

            setPageCount(pageCount)
            setCurrentPage(selectedPage)

            setOrgData(fetchedOrgData)
            setScientists(scientists)
            setTotalScientistCount(scientistCount)
        })()
    }, [filters])

    const previousFilters = useRef(filters.copy())

    const nameField = useMemo(() => {
        setNameFilterChanged(false)

        return <>
            <FilterString
                label={`Imie`}
                value={filters.name}
                onChanged={(value) => {
                    filters.name = value.length > 0 ? value : undefined

                    filters.syncNameCookie()
                    if(!hasFilters) { setHasFilters(true) }
                    if(!nameFilterChanged) { setNameFilterChanged(true) }
                }}
            />
            <FilterString
                label={`Nazwisko`}
                value={filters.surname}
                onChanged={(value) => {
                    filters.surname = value.length > 0 ? value : undefined

                    filters.syncSurnameCookie()
                    if(!hasFilters) { setHasFilters(true) }
                    if(!nameFilterChanged) { setNameFilterChanged(true) }
                }}
            />
        </>
    }, [filters, nameFilterChanged, hasFilters])

    const universityCheckboxes = useMemo(() => {
        setUniFilterChanged(false)

        return orgData?.universities.map((uni) => {
            return <FilterCheckbox
                key={uni.id}
                label={uni.name}
                count={0}
                isChecked={filters.universities.has(decodeURI(uni.name))}
                onChoice={(isChecked) => {
                    if (isChecked) {
                        filters.universities.add(uni.name)
                        console.log(`Added university filter: ${uni.name}`)
                    } else {
                        filters.universities.delete(uni.name)
                        console.log(`Removed university filter: ${uni.name}`)
                    }

                    setUsedOrg(UsedOrganization.university)
                    filters.syncUniversityCookie()

                    if(!uniFilterChanged) { setUniFilterChanged(true) }
                    if(!hasFilters) { setHasFilters(true) }
                }}
            />
        }) ?? []
    }, [filters, uniFilterChanged, hasFilters, orgData])

    const instituteCheckboxes = useMemo(() => {
        setInstituteFilterChanged(false)

        return orgData?.institutes.map((institute) => {
            return <FilterCheckbox
                key={institute.id}
                label={institute.name}
                count={0}
                isChecked={filters.institutes.has(decodeURI(institute.name))}
                onChoice={(isChecked: boolean) => {
                    if (isChecked) {
                        filters.institutes.add(institute.name)
                        console.log(`Added institute filter: ${institute.name}`)
                    } else {
                        filters.institutes.delete(institute.name)
                        console.log(`Removed institute filter: ${institute.name}`)
                    }

                    setUsedOrg(UsedOrganization.institute)
                    filters.syncInstituteCookie()

                    if(!instituteFilterChanged) { setInstituteFilterChanged(true) }
                    if(!hasFilters) { setHasFilters(true) }
                }}
            />
        }) ?? []
    }, [filters, instituteFilterChanged, hasFilters, orgData])

    const cathedraCheckboxes = useMemo(() => {
        setCathedraFilterChanged(false)

        return orgData?.cathedras.map((cathedra, index) => {
            return <FilterCheckbox
                key={index}
                label={cathedra.name}
                count={0}
                isChecked={filters.cathedras.has(decodeURI(cathedra.name))}
                onChoice={(isChecked: boolean) => {
                    if (isChecked) {
                        filters.cathedras.add(cathedra.name)
                        console.log(`Added cathedra filter: ${cathedra.name}`)
                    } else {
                        filters.cathedras.delete(cathedra.name)
                        console.log(`Removed cathedra filter: ${cathedra.name}`)
                    }

                    setUsedOrg(UsedOrganization.cathedra)
                    filters.syncCathedraCookie()

                    if(!hasFilters) { setHasFilters(true) }
                    if(!cathedraFilterChanged) { setCathedraFilterChanged(true) }
                }}
            />
        }) ?? []
    }, [filters, cathedraFilterChanged, hasFilters, orgData])

    const positionCheckboxes = useMemo(() => {
        setPositionFilterChanged(false)

        return orgData?.positions.map((position) => {
            return <FilterCheckbox
                key={position}
                label={position}
                count={0}
                isChecked={filters.positions.has(decodeURI(position)) }
                onChoice={(isChecked) => {
                    if(isChecked) {
                        filters.positions.add(position)
                        console.log(`Added position filter: ${position}`)
                    } else {
                        filters.positions.delete(position)
                        console.log(`Removed position filter: ${position}`)
                    }

                    filters.syncPositionCookie()

                    if(!hasFilters) { setHasFilters(true) }
                    if(!positionFilterChanged) { setPositionFilterChanged(true) }
                }}
            />
        }) ?? []
    }, [filters, positionFilterChanged, hasFilters, orgData])

    const publicationCountRange = useMemo(() => {
        setPublicationCountFilterChanged(false)

        return <FilterRange
            defaultMin={orgData?.publicationCount.min}
            defaultMax={orgData?.publicationCount.max}
            min={filters.publicationCount.min}
            max={filters.publicationCount.max}
            onChange={(min, max) => {
                filters.publicationCount.min = min || undefined
                filters.publicationCount.max = max || undefined

                filters.syncPublicationCountCookie()

                if(!hasFilters) { setHasFilters(true) }
                if(!publicationCountFilterChanged) { setPublicationCountFilterChanged(true) }
            }}
        />
    }, [filters, publicationCountFilterChanged, hasFilters, orgData])

    const ministerialPointRange = useMemo(() => {
        setMinisterialPointFilterChanged(false)

        return <FilterRange
            defaultMin={orgData?.ministerialPoints.min}
            defaultMax={orgData?.ministerialPoints.max}
            min={filters.ministerialPoints.min}
            max={filters.ministerialPoints.max}
            onChange={(min, max) => {
                filters.ministerialPoints.min = min || undefined
                filters.ministerialPoints.max = max || undefined

                filters.syncMinisterialPointsCookie()

                if(!hasFilters) { setHasFilters(true) }
                if(!ministerialPointFilterChanged) { setMinisterialPointFilterChanged(true) }
            }}
        />
    }, [filters, ministerialPointFilterChanged, hasFilters, orgData])

    const ifScorePointRange = useMemo(() => {
        setIfScoreFilterChanged(false)

        return <FilterRange
            min={filters.ifScore.min}
            max={filters.ifScore.max}
            onChange={(min, max) => {
                filters.ifScore.min = min || undefined
                filters.ifScore.max = max || undefined

                filters.syncIFScoreCookie()

                if(!hasFilters) { setHasFilters(true) }
                if(!ifScoreFilterChanged) { setIfScoreFilterChanged(true) }
            }}
        />
    }, [filters, ifScoreFilterChanged, hasFilters])

    const publishersCheckboxes = useMemo(() => {
        setPublishersFilterChanged(false)

        return orgData?.publishers.map((publisher) => {
            return <FilterCheckbox
                key={publisher}
                label={publisher}
                count={0}
                isChecked={filters.publishers.has(decodeURI(publisher)) }
                onChoice={(isChecked) => {
                    if(isChecked) {
                        filters.publishers.add(publisher)
                        console.log(`Added publisher filter: ${publisher}`)
                    } else {
                        filters.publishers.delete(publisher)
                        console.log(`Removed publisher filter: ${publisher}`)
                    }

                    filters.syncPublisherCookie()
                    if(!hasFilters) { setHasFilters(true) }
                    if(!publishersFilterChanged) { setPublishersFilterChanged(true) }
                }}
            />
        }) ?? []
    }, [filters, publishersFilterChanged, hasFilters, orgData])

    const journalTypeCheckboxes = useMemo(() => {
        setJournalFilterChanged(false)

        return orgData?.journalTypes.map((journalType) => {
            return <FilterCheckbox
                key={journalType}
                label={journalType}
                count={0}
                isChecked={filters.publicationTypes.has(decodeURI(journalType)) }
                onChoice={(isChecked) => {
                    if(isChecked) {
                        filters.publicationTypes.add(journalType)
                        console.log(`Added publication type filter: ${journalType}`)
                    } else {
                        filters.publicationTypes.delete(journalType)
                        console.log(`Removed publication type filter: ${journalType}`)
                    }

                    filters.syncPublicationTypeCookie()
                    if(!hasFilters) { setHasFilters(true) }
                    if(!journalFilterChanged) { setJournalFilterChanged(true) }
                }}
            />
        }) ?? []
    }, [filters, journalFilterChanged, hasFilters, orgData])

    // Shouldn't these be just a range?
    const publicationYearCheckboxes = useMemo(() => {
        setPublicationYearFilterChanged(false)

        return orgData?.publicationYears.map((year) => {
            return <FilterCheckbox
                key={year}
                label={year.toString()}
                count={0}
                isChecked={filters.publicationYears.has(year) }
                onChoice={(isChecked) => {
                    if(isChecked) {
                        filters.publicationYears.add(year)
                        console.log(`Added publication year filter: ${year}`)
                    } else {
                        filters.publicationYears.delete(year)
                        console.log(`Removed publication year filter: ${year}`)
                    }

                    filters.syncPublicationYearCookie()
                    if(!hasFilters) { setHasFilters(true) }
                    if(!publicationYearFilterChanged) { setPublicationYearFilterChanged(true) }
                }}
            />
        }) ?? []
    }, [filters, publicationYearFilterChanged, hasFilters, orgData])

    const scientistCells = useMemo(() => {
        setScientistsChanged(false)

        return (scientists ?? [])
            .map((scientist) => {
                return <ScientistCell
                    scientistID={scientist.id}
                    key={scientist.id}
                    title={scientist.academic_title}
                    name={`${scientist.first_name} ${scientist.last_name}`}
                    researchAreas={scientist.research_areas ?? []}
                    institute={"NYI (Institute)"}
                    cathedra={"NYI (Cathedra)"}
                    selectedForComparison={compareInfo.scientists.has(scientist.id)}
                    onSelectForComparison={(select) => {
                        let modified: boolean
                        if(select) {
                            modified = compareInfo.add(scientist.id)
                        } else {
                            modified = compareInfo.remove(scientist.id)
                        }

                        if(modified) {
                            compareInfo.syncCookie()
                            if(!scientistsChanged) { setScientistsChanged(true) }
                        }
                    }}
                />
            }
        )
    }, [compareInfo, scientists, scientistsChanged])

    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Naukowiec">{nameField}</FilterViewOption>
            <FilterViewOption header="Uczelnia">{universityCheckboxes}</FilterViewOption>
            <FilterViewOption header="Instytut">{instituteCheckboxes}</FilterViewOption>
            <FilterViewOption header="Katedra">{cathedraCheckboxes}</FilterViewOption>
            <FilterViewOption header="Stanowisko">{positionCheckboxes}</FilterViewOption>
            <FilterViewOption header="Ilość Publikacji">{publicationCountRange}</FilterViewOption>
            <FilterViewOption header="Ilość Punktów Ministerialnych">{ministerialPointRange}</FilterViewOption>
            <FilterViewOption header="Współczynnik IF">{ifScorePointRange}</FilterViewOption>
            <FilterViewOption header="Wydawca">{publishersCheckboxes}</FilterViewOption>
            <FilterViewOption header="Lata Wydawania Publikacji">{publicationYearCheckboxes}</FilterViewOption>
            <FilterViewOption header="Rodzaj Publikacji">{journalTypeCheckboxes}</FilterViewOption>

            <div className={`bg-black/80 w-full flex-1`}></div>
        </div>
        <div className={`flex-1`}>
            <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                <p className={`text-3xl font-[600]`}>{totalScientistCount !== null ? `Znaleziono ${totalScientistCount} wyników wyszukiwania` : `Odświeżam wyniki...`}</p>
                <SearchOptions
                    onRefresh={async () => {
                        setScientists(null)
                        setTotalScientistCount(null)
                        previousFilters.current = filters.copy()

                        const result: SearchResponse | null = await filters.search(perPageLimit)

                        if (result) {
                            const count = result.count ?? 0

                            const pageCount = Math.ceil(count / perPageLimit)
                            const selectedPage = pageCount == 0 ? 0 : 1

                            setScientists(result.scientists ?? [])
                            setTotalScientistCount(count)

                            setPageCount(pageCount)
                            setCurrentPage(selectedPage)
                        }
                    }}
                    canResetFilters={hasFilters}
                    onFilterReset={() => {
                        filters.resetFilters()
                        setHasFilters(false)
                    }}
                    selectedPage={currentPage}
                    pageCount={pageCount}
                    onPageChange={(page) => {
                        if(page != currentPage) {
                            setCurrentPage(page)
                            setScientists(null)

                            previousFilters.current.search(perPageLimit, page)
                                .then((searchResponse) => {
                                    setScientists(searchResponse?.scientists ?? [])
                                })
                        }
                    }}
                    isSearchInProgress={scientists == null}
                    compareCount={compareInfo.scientists.size}
                    onCompare={() => { router.replace("/compare") }}
                />
            </div>
            {scientistCells}
        </div>
    </div>
}

async function fetchInitialOrganizationData(): Promise<OrganizationData> {
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

    return fetchedOrgData
}