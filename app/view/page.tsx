'use client'

import {FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {
    APIRange,
    fetchGetOrganizationsFilter,
    fetchJournalTypes,
    fetchMinisterialScoresRange,
    fetchPositions,
    fetchPublicationCountRange,
    fetchPublicationYears,
    fetchPublishers,
    Organization,
    Scientist,
    SearchResponse,
} from "@/lib/API";
import {useEffect, useMemo, useRef, useState} from "react";
import {SearchOptions, SortMethod} from "@/components/SearchOptions";
import {FilterState} from "@/lib/FilterState";
import {getCookies} from "cookies-next/client";
import {FilterRange} from "@/components/FilterViewRange";
import {FilterString} from "@/components/FilterViewString";
import {CompareState} from "@/lib/CompareState";
import {useRouter, useSearchParams} from "next/navigation";
import PublicationScoreDynamicFilter from "@/components/PublicationScoreDynamicFilter";
import Toolbar, {ContrastState} from "@/components/Toolbar";
import {FilterCheckbox} from "@/components/FilterCheckbox";

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
    const compareLimit = CompareState.LIMIT
    const router = useRouter()
    const query = useSearchParams()

    const highContrastMode = query.has("highContrast")
    const [filters, setFilters] = useState<FilterState>(new FilterState())

    useEffect(() => {
        console.log(`Setting filters: ${filters}`)
    }, [filters])

    const compareInfo = useMemo(() => {
        const state = new CompareState()
        state.readFromCookies(getCookies() ?? {})
        console.log("Reading comparison info from cookies...")

        return state
    }, [])

    const [orgData, setOrgData] = useState<OrganizationData | null>(null);
    const [scientists, setScientists] = useState<Scientist[] | null>(null)
    const [hasFilters, setHasFilters] = useState<boolean>(false)

    const [usedOrg, setUsedOrg] = useState<UsedOrganization | undefined>()
    const [totalScientistCount, setTotalScientistCount] = useState<number | null>(null)

    const [currentPage, setCurrentPage] = useState<number>(1)
    const [pageCount, setPageCount] = useState<number>(1)

    const [sortMethod, setSortMethod] = useState<SortMethod | undefined>()

    const [nameFilterChanged, setNameFilterChanged] = useState<boolean>(true)
    const [uniFilterChanged, setUniFilterChanged] = useState<boolean>(true)
    const [instituteFilterChanged, setInstituteFilterChanged] = useState<boolean>(true)
    const [cathedraFilterChanged, setCathedraFilterChanged] = useState<boolean>(true)
    const [positionFilterChanged, setPositionFilterChanged] = useState<boolean>(true)
    const [publicationCountFilterChanged, setPublicationCountFilterChanged] = useState<boolean>(true)
    const [ministerialPointFilterChanged, setMinisterialPointFilterChanged] = useState<boolean>(true)
    const [publishersFilterChanged, setPublishersFilterChanged] = useState<boolean>(true)
    const [journalFilterChanged, setJournalFilterChanged] = useState<boolean>(true)
    const [scientistsChanged, setScientistsChanged] = useState<boolean>(true)

    // Only allows selecting a single organization type (unselects the rest)
    useMemo(() => {
        if(usedOrg !== undefined) {
            if (usedOrg != UsedOrganization.university) {
                filters.universities.clear()
                setUniFilterChanged(true)
                filters.syncUniversityCookie()
            }
            if (usedOrg != UsedOrganization.institute) {
                filters.institutes.clear()
                setInstituteFilterChanged(true)
                filters.syncInstituteCookie()
            }
            if (usedOrg != UsedOrganization.cathedra) {
                filters.cathedras.clear()
                setCathedraFilterChanged(true)
                filters.syncCathedraCookie()
            }
        }
    }, [filters, usedOrg])

    const previousFilters = useRef(filters.copy())
    useEffect(() => {
        (async function () {
            const filters = new FilterState()

            filters.readFromCookies(getCookies() ?? {})
            console.log("Reading filters from cookies...")

            const fetchedOrgData = await fetchInitialOrganizationData()
            const searchResponse: SearchResponse | null = await filters.search(perPageLimit)

            const scientists = searchResponse?.scientists ?? []
            const scientistCount = searchResponse?.count ?? 0

            const pageCount = Math.ceil(scientistCount / perPageLimit)
            const selectedPage = pageCount == 0 ? 0 : 1

            setPageCount(pageCount)
            setCurrentPage(selectedPage)

            setFilters(filters)
            setOrgData(fetchedOrgData)
            setScientists(scientists)
            setTotalScientistCount(scientistCount)

            const initialUsedOrganization =
                filters.cathedras.size > 0
                    ? UsedOrganization.cathedra
                    : filters.institutes.size > 0
                        ? UsedOrganization.institute
                        : UsedOrganization.university

            setUsedOrg(initialUsedOrganization)
            previousFilters.current = filters.copy()
            setHasFilters(filters.hasFilters())
        })()
    }, [])


    const nameField = useMemo(() => {
        setNameFilterChanged(false)

        return <>
            <FilterString
                label={`Imie`}
                value={filters.name}
                onChanged={(value) => {
                    filters.name = value.length > 0 ? value : undefined

                    filters.syncNameCookie()

                    setHasFilters(true)
                    if (!nameFilterChanged) {
                        setNameFilterChanged(true)
                    }
                }}
            />
            <FilterString
                label={`Nazwisko`}
                value={filters.surname}
                onChanged={(value) => {
                    filters.surname = value.length > 0 ? value : undefined

                    filters.syncSurnameCookie()

                    setHasFilters(true)
                    if (!nameFilterChanged) {
                        setNameFilterChanged(true)
                    }
                }}
            />
        </>
    }, [filters, nameFilterChanged])

    const universityCheckboxes = useMemo(() => {
        setUniFilterChanged(false)

        return orgData?.universities.map((uni) => {
            return <FilterCheckbox
                key={uni.id}
                label={uni.name}
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

                    setHasFilters(true)
                    if (!uniFilterChanged) {
                        setUniFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, uniFilterChanged, orgData])

    const instituteCheckboxes = useMemo(() => {
        setInstituteFilterChanged(false)

        return orgData?.institutes.map((institute) => {
            return <FilterCheckbox
                key={institute.id}
                label={institute.name}
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

                    setHasFilters(true)
                    if (!instituteFilterChanged) {
                        setInstituteFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, instituteFilterChanged, orgData])

    const cathedraCheckboxes = useMemo(() => {
        setCathedraFilterChanged(false)

        return orgData?.cathedras.map((cathedra, index) => {
            return <FilterCheckbox
                key={index}
                label={cathedra.name}
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

                    setHasFilters(true)
                    if (!cathedraFilterChanged) {
                        setCathedraFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, cathedraFilterChanged, orgData])

    const positionCheckboxes = useMemo(() => {
        setPositionFilterChanged(false)

        return orgData?.positions.map((position) => {
            return <FilterCheckbox
                key={position}
                label={position}
                isChecked={filters.positions.has(decodeURI(position))}
                onChoice={(isChecked) => {
                    if (isChecked) {
                        filters.positions.add(position)
                        console.log(`Added position filter: ${position}`)
                    } else {
                        filters.positions.delete(position)
                        console.log(`Removed position filter: ${position}`)
                    }

                    filters.syncPositionCookie()

                    setHasFilters(true)
                    if (!positionFilterChanged) {
                        setPositionFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, positionFilterChanged, orgData])

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

                setHasFilters(true)
                if (!publicationCountFilterChanged) {
                    setPublicationCountFilterChanged(true)
                }
            }}
        />
    }, [filters, publicationCountFilterChanged, orgData])

    const ministerialPointRange = useMemo(() => {
        setMinisterialPointFilterChanged(false)

        return <div className={`flex flex-col gap-2`}>
            <div>
                <p className={`font-semibold p-1 pl-2 pr-2 ${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext"} rounded-t-2xl`}>Razem</p>
                <div
                    className={`border-l-2 border-r-2 border-b-2 p-1 ${highContrastMode ? "border-black" : "border-black/80"} rounded-b-2xl`}>
                    <FilterRange
                        defaultMin={orgData?.ministerialPoints.min}
                        defaultMax={orgData?.ministerialPoints.max}
                        min={filters.ministerialPoints.min}
                        max={filters.ministerialPoints.max}
                        onChange={(min, max) => {
                            filters.ministerialPoints.min = min || undefined
                            filters.ministerialPoints.max = max || undefined

                            filters.syncMinisterialPointsCookie()

                            setHasFilters(true)
                            if (!ministerialPointFilterChanged) {
                                setMinisterialPointFilterChanged(true)
                            }
                        }}
                    />
                </div>
            </div>
            <PublicationScoreDynamicFilter
                label="W Latach"
                filters={filters.publicationYearFilters}
                onAdded={(v) => {
                    const existingIndex = filters.publicationYearFilters
                        .findIndex((filter) => filter.year === v.year)

                    if (existingIndex >= 0) {
                        filters.publicationYearFilters[existingIndex] = {
                            year: v.year,
                            minScore: v.minScore,
                            maxScore: v.maxScore
                        }
                    } else {
                        filters.publicationYearFilters.push(v)
                    }

                    filters.syncYearScoreCookie()

                    setHasFilters(true)
                    if (!ministerialPointFilterChanged) {
                        setMinisterialPointFilterChanged(true)
                    }
                }}
                onRemoved={(v) => {
                    const index = filters.publicationYearFilters
                        .findIndex((filter) => filter.year === v.year)

                    if (index > -1) {
                        filters.publicationYearFilters.splice(index, 1)

                        filters.syncYearScoreCookie()

                        setHasFilters(true)
                        if (!ministerialPointFilterChanged) {
                            setMinisterialPointFilterChanged(true)
                        }
                    }
                }}
                onClear={() => {
                    filters.publicationYearFilters = []

                    filters.syncYearScoreCookie()

                    setHasFilters(true)
                    if (!ministerialPointFilterChanged) {
                        setMinisterialPointFilterChanged(true)
                    }
                }}
            />
        </div>
    }, [highContrastMode, filters, ministerialPointFilterChanged, orgData])

    const publishersCheckboxes = useMemo(() => {
        setPublishersFilterChanged(false)

        return orgData?.publishers.map((publisher) => {
            return <FilterCheckbox
                key={publisher}
                label={publisher}
                isChecked={filters.publishers.has(decodeURI(publisher))}
                onChoice={(isChecked) => {
                    if (isChecked) {
                        filters.publishers.add(publisher)
                        console.log(`Added publisher filter: ${publisher}`)
                    } else {
                        filters.publishers.delete(publisher)
                        console.log(`Removed publisher filter: ${publisher}`)
                    }

                    filters.syncPublisherCookie()

                    setHasFilters(true)
                    if (!publishersFilterChanged) {
                        setPublishersFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, publishersFilterChanged, orgData])

    const journalTypeCheckboxes = useMemo(() => {
        setJournalFilterChanged(false)

        return orgData?.journalTypes.map((journalType) => {
            return <FilterCheckbox
                key={journalType}
                label={journalType}
                isChecked={filters.publicationTypes.has(decodeURI(journalType))}
                onChoice={(isChecked) => {
                    if (isChecked) {
                        filters.publicationTypes.add(journalType)
                        console.log(`Added publication type filter: ${journalType}`)
                    } else {
                        filters.publicationTypes.delete(journalType)
                        console.log(`Removed publication type filter: ${journalType}`)
                    }

                    filters.syncPublicationTypeCookie()

                    setHasFilters(true)
                    if (!journalFilterChanged) {
                        setJournalFilterChanged(true)
                    }
                }}
            />
        }) ?? []
    }, [filters, journalFilterChanged, orgData])

    const scientistCells = useMemo(() => {
        setScientistsChanged(false)

        return (scientists ?? [])
            .toSorted((left, right) => {
                switch (sortMethod) {
                    case SortMethod.Name:
                        return `${left.first_name} ${left.last_name}`.localeCompare(`${right.first_name} ${right.last_name}`)
                    case SortMethod.NameDescending:
                        return `${right.first_name} ${right.last_name}`.localeCompare(`${left.first_name} ${left.last_name}`)
                    case SortMethod.PublicationCount:
                        return (left.bibliometrics.publication_count ?? 0) - (right.bibliometrics.publication_count ?? 0)
                    case SortMethod.PublicationCountDescending:
                        return (right.bibliometrics.publication_count ?? 0) - (left.bibliometrics.publication_count ?? 0)
                    case SortMethod.MinisterialPoints:
                        return (left.bibliometrics.ministerial_score ?? 0) - (right.bibliometrics.ministerial_score ?? 0)
                    case SortMethod.MinisterialPointsDescending:
                        return (right.bibliometrics.ministerial_score ?? 0) - (left.bibliometrics.ministerial_score ?? 0)
                    default:
                        return 0
                }
            })
            .map((scientist) => {
                return <ScientistCell
                    key={scientist.id}
                    scientist={scientist}
                    selectedForComparison={compareInfo.scientists.has(scientist.id)}
                    onSelectForComparison={(select) => {
                        let modified: boolean
                        if (select) {
                            modified = compareInfo.add(scientist.id)
                        } else {
                            modified = compareInfo.remove(scientist.id)
                        }

                        if (modified) {
                            compareInfo.syncCookie()
                            if (!scientistsChanged) {
                                setScientistsChanged(true)
                            }
                        }
                    }}
                />
            })
    }, [compareInfo, scientists, scientistsChanged, sortMethod])

    let resultCountSuffix: string
    switch((totalScientistCount ?? 0) % 10) {
        case 1:
            resultCountSuffix = ""
            break
        case 2:
        case 3:
        case 4:
            resultCountSuffix = "i"
            break
        default:
            resultCountSuffix = "ów"
            break
    }
    return <Toolbar
        highContrastMode={highContrastMode}
        onToggleContrast={
            () => {
                const queryCopy = new URLSearchParams(query)
                if (highContrastMode) {
                    queryCopy.delete("highContrast")
                } else {
                    queryCopy.append("highContrast", "1")
                }
                router.replace("/view?" + queryCopy.toString())
            }
        }
    >
        <ContrastState.Provider value={highContrastMode}>
            <div className={`flex min-h-full h-fit w-full`}>
                <div className={`min-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
                    <FilterViewOption
                        header="Naukowiec"
                        expanded={filters.extendedTabs.has(0)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(0)
                            } else {
                                filters.extendedTabs.delete(0)
                            }

                            filters.syncExtendedTabCookie()
                            setNameFilterChanged(true)
                        }}
                    >
                        {nameField}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Uczelnia"
                        expanded={filters.extendedTabs.has(1)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(1)
                            } else {
                                filters.extendedTabs.delete(1)
                            }

                            filters.syncExtendedTabCookie()
                            setUniFilterChanged(true)
                        }}
                    >
                        {universityCheckboxes}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Instytut"
                        expanded={filters.extendedTabs.has(2)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(2)
                            } else {
                                filters.extendedTabs.delete(2)
                            }

                            filters.syncExtendedTabCookie()
                            setInstituteFilterChanged(true)
                        }}
                    >
                        {instituteCheckboxes}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Katedra"
                        expanded={filters.extendedTabs.has(3)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(3)
                            } else {
                                filters.extendedTabs.delete(3)
                            }

                            filters.syncExtendedTabCookie()
                            setCathedraFilterChanged(true)
                        }}
                    >
                        {cathedraCheckboxes}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Stanowisko"
                        expanded={filters.extendedTabs.has(4)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(4)
                            } else {
                                filters.extendedTabs.delete(4)
                            }

                            filters.syncExtendedTabCookie()
                            setPositionFilterChanged(true)
                        }}
                    >
                        {positionCheckboxes}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Ilość Publikacji"
                        expanded={filters.extendedTabs.has(5)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(5)
                            } else {
                                filters.extendedTabs.delete(5)
                            }

                            filters.syncExtendedTabCookie()
                            setPublicationCountFilterChanged(true)
                        }}
                    >
                        {publicationCountRange}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Ilość Punktów Ministerialnych"
                        expanded={filters.extendedTabs.has(6)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(6)
                            } else {
                                filters.extendedTabs.delete(6)
                            }

                            filters.syncExtendedTabCookie()
                            setMinisterialPointFilterChanged(true)
                        }}
                    >
                        {ministerialPointRange}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Wydawca"
                        expanded={filters.extendedTabs.has(7)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(7)
                            } else {
                                filters.extendedTabs.delete(7)
                            }

                            filters.syncExtendedTabCookie()
                            setPublishersFilterChanged(true)
                        }}
                    >
                        {publishersCheckboxes}
                    </FilterViewOption>

                    <FilterViewOption
                        header="Rodzaj Publikacji"
                        expanded={filters.extendedTabs.has(8)}
                        onExpanded={(isExpanded) => {
                            if(isExpanded) {
                                filters.extendedTabs.add(8)
                            } else {
                                filters.extendedTabs.delete(8)
                            }

                            filters.syncExtendedTabCookie()
                            setJournalFilterChanged(true)
                        }}
                    >
                        {journalTypeCheckboxes}
                    </FilterViewOption>

                    <div className={`bg-black/80 w-full flex-1`}></div>
                </div>
                <div className={`flex-1`}>
                    <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                        <p className={`text-3xl font-[600]`}>{totalScientistCount !== null ? `Znaleziono ${totalScientistCount} wynik${resultCountSuffix} wyszukiwania` : `Odświeżam wyniki...`}</p>
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
                                setFilters(filters.copy())
                                setHasFilters(false)
                            }}
                            sortMethod={sortMethod}
                            onSortMethodChange={(sortMethod) => {
                                setSortMethod(sortMethod)
                            }}
                            selectedPage={currentPage}
                            pageCount={pageCount}
                            onPageChange={(page) => {
                                if (page != currentPage) {
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
                            compareLimit={compareLimit}
                            onCompare={() => {
                                const contrast = highContrastMode ? "?highContrast=1" : ""
                                router.replace("/compare" + contrast)
                            }}
                            onResetCompare={
                                () => {
                                    compareInfo.scientists.clear()
                                    compareInfo.syncCookie()
                                    setScientistsChanged(true)
                                }
                            }
                        />
                    </div>
                    {scientistCells}
                </div>
            </div>
        </ContrastState.Provider>
    </Toolbar>
}

async function fetchInitialOrganizationData(): Promise<OrganizationData> {
    const allOrganizations = await fetchGetOrganizationsFilter() ?? []

    const fetchedUniversities: Organization[] = []
    const fetchedCathedras: Organization[] = []
    const fetchedInstitutes: Organization[] = []

    const existingItems = new Set<string>()
    for (const org of allOrganizations) {
        if(!existingItems.has(org.name)) {
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

            existingItems.add(org.name)
        } else {
            console.log(`Repeat: ${org.name}`)
        }
    }

    const publicationCountRange: APIRange = await fetchPublicationCountRange()
    const ministerialPointRange: APIRange = await fetchMinisterialScoresRange()

    // HACK: API gives some empty strings for some reason. Just filter them out since you can't search for these anyways (?)
    const publishers: string[] = (await fetchPublishers()).filter((x) => x != " " && x != "")
    const positions: string[] = (await fetchPositions()).filter((x) => x != " " && x != "")
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