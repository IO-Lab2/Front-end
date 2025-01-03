import {UUID} from "node:crypto";

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/schemas/OrganizationBody> */
export interface OrganizationBody {
    /** Organization ID */
    id: UUID,
    /** Name of the organization */
    name: string,
    /** Type of the organization */
    type: string,
}

export interface Scientist {
    academic_title: string,
    created_at: string,
    email?: string,
    first_name: string,
    id: UUID,
    last_name: string,
    profile_url?: string,
    research_areas?: Array<{ name: string }>,
    updated_at: string,
}

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/operations/Get%20Organizations%20Filter> */
export type GetOrganizationsFilterResponse = OrganizationBody[]

export interface SearchBody {
    academicTitles?: string[],
    ministerialScoreMax?: number,
    ministerialScoreMin?: number,
    name?: string,
    organizations?: string[],
    publicationsMax?: number,
    publicationsMin?: number,
    researchAreas?: string[],
    surname?: string
}

export interface SearchResponse {
    count?: number,
    scientists?: Scientist[]
}

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

export async function fetchPublicationCountRange(): Promise<{ largest: number, smallest: number }> {
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
export async function fetchMinisterialScoresRange(): Promise<{ largest: number, smallest: number }> {
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

// doesn't work yet
export async function fetchSearch(query: SearchBody): Promise<SearchResponse> {
    const queryParams = new URLSearchParams()

    if(query.academicTitles !== undefined) {
        // <https://stackoverflow.com/a/42636148>
        for(const title of query.academicTitles) {
            queryParams.append("academic_titles[]", title)
        }
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
    if(query.publicationsMax !== undefined) {
        queryParams.append("publications_max", query.publicationsMax.toString())
    }
    if(query.publicationsMin !== undefined) {
        queryParams.append("publications_min", query.publicationsMin.toString())
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

    try {
        return await fetch("https://api.epickaporownywarkabazwiedzyuczelni.rocks/api/search?" + queryParams, {
            method: "GET",
        }).then(res => res.json())
    } catch(ex) {
        console.error(`Wyszukiwanie nie powiodło się: ${ex}`)
        return {}
    }
}