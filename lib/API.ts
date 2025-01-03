import {UUID} from "node:crypto";

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/schemas/OrganizationBody> */
export interface Organization {
    /** Organization ID */
    id: UUID,
    /** Name of the organization */
    name: string,
    /** Type of the organization */
    type: string,
}

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/schemas/Bibliometrics> */
export interface Bibliometrics {
    hIndexScopus: number,
    hIndexWos: number,
    ministerialScore?: number,
    publicationCount?: number
}

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/schemas/ScientistBody> */
export interface Scientist {
    /** Academic title of the scientist. */
    academic_title: string,
    /** Bibliometric indicators of the scientist. */
    bibliometrics: Bibliometrics,
    /** Creation date of the scientist. */
    created_at: string,
    /** **(Optional)** Email of the scientist.  */
    email?: string,
    /** First name of the scientist. */
    first_name: string,
    /** Scientist ID. */
    id: UUID,
    /** Last name of the scientist. */
    last_name: string,
    /** **(Optional)** Position of the scientist. */
    position?: string,
    /** **(Optional)** Profile URL of the scientist. */
    profile_url?: string,
    /**
     * **(Optional)** Ministerial score points grouped by year.
     * - `score`: Total score for the publications.
     * - `year`: Year of the publication score.
     * */
    publication_scores?: Array<{ score?: number, year?: string }>, // TODO
    /**
     * **(Optional)** Research areas of the scientist.
     * - `name`: Name of the research area.
     * */
    research_areas?: Array<{ name: string }>,
    /** Last update date of the scientist. */
    updated_at: string,
}

export interface YearScoreFilter {
    maxScore: number,
    minScore: number,
    year: number
}

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/operations/Get%20Organizations%20Filter> */
export type GetOrganizationsFilterResponse = Organization[]

/** Available filters to apply when querying for scientists. */
export interface SearchQuery {
    academicTitles?: string[],
    journalTypes?: string[],
    limit?: number,
    ministerialScoreMax?: number,
    ministerialScoreMin?: number,
    name?: string,
    organizations?: string[],
    page?: number,
    positions?: string[],
    publicationsMax?: number,
    publicationsMin?: number,
    publicationYears?: number[],
    publishers?: string[],
    researchAreas?: string[],
    surname?: string
    yearScoreFilters?: YearScoreFilter[],
}

export interface SearchResponse {
    count?: number,
    scientists?: Scientist[]
}

export interface APIRange {
    smallest: number,
    largest: number
}

export interface ResearchArea {
    id?: UUID,
    name?: string
}

interface PublicationYear { publication_date?: string }
interface Publisher { publisher?: string }
interface ScientistPosition { position?: string }
interface JournalType { journal_type?: string }

export async function fetchGetOrganizationsTree(id: UUID | null): Promise<GetOrganizationsFilterResponse | null> {
    try {
        const queryParams = new URLSearchParams()
        if(id != null) { queryParams.append("id", id) }

        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/organizations-tree?" + queryParams, {
            method: "GET",
            cache: "force-cache",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Nie udało się pobrać danych o drzewie organizacji (root: ${id ?? "null"}): ${ex}`)
        return null
    }
}

export async function fetchGetOrganizationsFilter(): Promise<GetOrganizationsFilterResponse | null> {
    try {
        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/organizations", {
            method: "GET",
            cache: "force-cache",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Nie udało się pobrać danych o organizacjach: ${ex}`)
        return null
    }
}

export async function fetchPublicationCountRange(): Promise<APIRange> {
    try {
        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/publication-counts", {
            method: "GET",
            cache: "force-cache",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Nie udało się pobrać zakresu ilości publikacji: ${ex}`)
        return { largest: 0, smallest: 0 }
    }
}
export async function fetchMinisterialScoresRange(): Promise<APIRange> {
    try {
        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/ministerial-scores", {
            method: "GET",
            cache: "force-cache",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Nie udało się pobrać zakresu punktów ministerialnych: ${ex}`)
        return { largest: 0, smallest: 0 }
    }
}

export async function fetchPublishers() : Promise<string[]> {
    try {
        const publishers = await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/publishers", {
            method: "GET",
            cache: "force-cache"
        }).then(res => res.json())

        if(Array.isArray(publishers)) {
            return publishers.flatMap(publisher => {
                return (publisher as Publisher).publisher ?? []
            })
        } else {
            return []
        }
    } catch(ex) {
        console.error(`Nie udało się pobrać listy wydawców: ${ex}`)
        return []
    }
}

export async function fetchPositions(): Promise<string[]> {
    try {
        const positions = await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/positions", {
            method: "GET",
            cache: "force-cache"
        }).then(res => res.json())

        if(Array.isArray(positions)) {
            return positions.flatMap(position => {
                return (position as ScientistPosition).position ?? []
            })
        } else {
            return []
        }
    } catch(ex) {
        console.error(`Nie udało się pobrać listy stanowisk: ${ex}`)
        return []
    }
}

export async function fetchResearchAreas(): Promise<ResearchArea[]> {
    try {
        const areas = await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/research-areas", {
            method: "GET",
            cache: "force-cache"
        }).then(res => res.json())

        if(Array.isArray(areas)) {
            return areas
        } else {
            return []
        }
    } catch(ex) {
        console.error(`Nie udało się pobrać listy dziedzin naukowych: ${ex}`)
        return []
    }
}

export async function fetchPublicationYears(): Promise<number[]> {
    try {
        const years = await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/publication-years", {
            method: "GET",
            cache: "force-cache"
        }).then(res => res.json())

        if(Array.isArray(years)) {
            return years.flatMap(year => {
                return (new Date((year as PublicationYear).publication_date ?? "")).getFullYear()
            })
        } else {
            return []
        }
    } catch(ex) {
        console.error(`Nie udało się pobrać listy dziedzin naukowych: ${ex}`)
        return []
    }
}

export async function fetchJournalTypes(): Promise<string[]> {
    try {
        const journals = await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/filters/journal-types", {
            method: "GET",
            cache: "force-cache"
        }).then(res => res.json())

        if(Array.isArray(journals)) {
            return journals.flatMap(journal => {
                return (journal as JournalType).journal_type ?? []
            })
        } else {
            return []
        }
    } catch(ex) {
        console.error(`Nie udało się pobrać listy rodzajów publikacji: ${ex}`)
        return []
    }
}

export async function fetchSearch(query: SearchQuery): Promise<SearchResponse | null> {
    const queryParams = new URLSearchParams()

    if(query.academicTitles !== undefined) {
        // FIXME apparently the API server only reads the first item in the array and ignores the rest? Figure out whichever query format it wants.
        for(const title of query.academicTitles) {
            queryParams.append("academic_titles[]", title)
        }
    }
    if(query.journalTypes !== undefined) {
        for(const journal of query.journalTypes) {
            queryParams.append("journal_types[]", journal)
        }
    }
    if(query.limit !== undefined) {
        queryParams.append("limit", query.limit.toString())
    }
    if(query.ministerialScoreMax !== undefined) {
        queryParams.append("ministerial_score_max", query.ministerialScoreMax.toString())
    }
    if(query.ministerialScoreMin !== undefined) {
        queryParams.append("ministerial_score_min", query.ministerialScoreMin.toString())
    }
    if(query.name !== undefined) {
        queryParams.append("name", query.name)
    }
    if(query.organizations !== undefined) {
        for(const organization of query.organizations) {
            if(organization != "") {
                queryParams.append("organizations[]", organization)
            }
        }
    }
    if(query.page !== undefined) {
        queryParams.append("page", query.page.toString())
    }
    if(query.positions !== undefined) {
        for(const position of query.positions) {
            if(position != "") {
                queryParams.append("positions[]", position)
            }
        }
    }
    if(query.publicationsMax !== undefined) {
        queryParams.append("publications_max", query.publicationsMax.toString())
    }
    if(query.publicationsMin !== undefined) {
        queryParams.append("publications_min", query.publicationsMin.toString())
    }
    if(query.publicationYears !== undefined) {
        for(const year of query.publicationYears) {
            queryParams.append("publications_years[]", year.toString()) // FIXME doesn't work?
        }
    }
    if(query.publishers !== undefined) {
        for(const publisher of query.publishers) {
            queryParams.append("publishers[]", publisher.toString())
        }
    }
    if(query.researchAreas !== undefined) {
        for(const area of query.researchAreas) {
            if(area != "") {
                queryParams.append("research_areas[]", area)
            }
        }
    }
    if(query.surname !== undefined) {
        queryParams.append("surname", query.surname)
    }

    /*
     * TODO figure out how do you even send objects in URL queries?
     * if(query.yearScoreFilters !== undefined) {}
     */

    try {
        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/search?" + queryParams, {
            method: "GET",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Wyszukiwanie nie powiodło się: ${ex}`)
        return null
    }
}