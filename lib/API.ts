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

/** API reference: <https://api.epickaporownywarkabazwiedzyuczelni.rocks/docs#/operations/Get%20Organizations%20Filter> */
export type GetOrganizationsFilterResponse = OrganizationBody[]

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