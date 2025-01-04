import {setCookie, deleteCookie} from "cookies-next/client";

export class FilterState {
    universities: Set<string> = new Set()
    institutes: Set<string> = new Set()
    cathedras: Set<string> = new Set()
    positions: Set<string> = new Set()
    ministerialPoints: {
        min?: number
        max?: number
    } = { }
    publicationCount: {
        min?: number
        max?: number
    } = { }
    ifScore: {
        min?: number
        max?: number
    } = { }
    publishers: Set<string> = new Set()
    publicationYears: Set<number> = new Set()
    publicationTypes: Set<string> = new Set()

    name?: string
    surname?: string

    resetFilters(): void {
        this.universities.clear()
        this.institutes.clear()
        this.cathedras.clear()
        this.positions.clear()
        this.ministerialPoints.min = undefined
        this.ministerialPoints.max = undefined
        this.publicationCount.min = undefined
        this.publicationCount.max = undefined
        this.ifScore.min = undefined
        this.ifScore.max = undefined
        this.publishers.clear()
        this.publicationYears.clear()
        this.publicationTypes.clear()
        this.name = undefined
        this.surname = undefined

        deleteCookie(FilterState.COOKIE_UNIVERSITIES, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_INSTITUTES, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_CATHEDRAS, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_POSITIONS, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MIN, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MAX, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_PUBLICATION_COUNT_MIN, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_PUBLICATION_COUNT_MAX, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_IF_SCORE_MIN, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_IF_SCORE_MAX, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_PUBLISHERS, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_PUBLICATION_YEARS, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_PUBLICATION_TYPE, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_NAME, { sameSite: "strict" })
        deleteCookie(FilterState.COOKIE_SURNAME, { sameSite: "strict" })
    }

    getAllOrganizationNames(): string[] {
        const combined: string[] = []
        for(const uni of this.universities) {
            combined.push(uni)
        }
        for(const institute of this.institutes) {
            combined.push(institute)
        }
        for(const cathedra of this.cathedras) {
            combined.push(cathedra)
        }

        return combined
    }

    syncUniversityCookie() {
        setCookie(FilterState.COOKIE_UNIVERSITIES, packCookieSet(this.universities), {
            sameSite: "strict"
        })
    }

    syncInstituteCookie() {
        setCookie(FilterState.COOKIE_INSTITUTES, packCookieSet(this.institutes), {
            sameSite: "strict"
        })
    }

    syncCathedraCookie() {
        setCookie(FilterState.COOKIE_CATHEDRAS, packCookieSet(this.cathedras), {
            sameSite: "strict"
        })
    }

    syncPositionCookie() {
        setCookie(FilterState.COOKIE_POSITIONS, packCookieSet(this.positions), {
            sameSite: "strict"
        })
    }

    syncNameCookie() {
        if(this.name) {
            setCookie(FilterState.COOKIE_NAME, this.name, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_NAME, {
                sameSite: "strict"
            })
        }
    }

    syncSurnameCookie() {
        if(this.surname) {
            setCookie(FilterState.COOKIE_SURNAME, this.surname, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_SURNAME, {
                sameSite: "strict"
            })
        }
    }

    syncMinisterialPointsCookie() {
        if(this.ministerialPoints.min !== undefined) {
            setCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MIN, this.ministerialPoints.min, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MIN)
        }

        if(this.ministerialPoints.max !== undefined) {
            setCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MIN, this.ministerialPoints.max, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_MINISTERIAL_POINTS_MAX)
        }
    }

    syncPublicationCountCookie() {
        if(this.publicationCount.min !== undefined) {
            setCookie(FilterState.COOKIE_PUBLICATION_COUNT_MIN, this.publicationCount.min, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_PUBLICATION_COUNT_MIN)
        }

        if(this.publicationCount.max !== undefined) {
            setCookie(FilterState.COOKIE_PUBLICATION_COUNT_MAX, this.publicationCount.max, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_PUBLICATION_COUNT_MAX)
        }
    }

    syncIFScoreCookie() {
        if(this.ifScore.min !== undefined) {
            setCookie(FilterState.COOKIE_IF_SCORE_MIN, this.ifScore.min, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_IF_SCORE_MIN)
        }

        if(this.ifScore.max !== undefined) {
            setCookie(FilterState.COOKIE_IF_SCORE_MAX, this.ifScore.max, {
                sameSite: "strict"
            })
        } else {
            deleteCookie(FilterState.COOKIE_IF_SCORE_MAX)
        }

    }

    syncPublisherCookie() {
        setCookie(FilterState.COOKIE_PUBLISHERS, packCookieSet(this.publishers), {
            sameSite: "strict"
        })
    }

    syncPublicationYearCookie() {
        setCookie(FilterState.COOKIE_PUBLICATION_YEARS, packCookieSet(this.publicationYears), {
            sameSite: "strict"
        })
    }

    syncPublicationTypeCookie() {
        setCookie(FilterState.COOKIE_PUBLICATION_TYPE, packCookieSet(this.publicationTypes), {
            sameSite: "strict"
        })
    }

    readFromCookies(cookies: { [key: string]: string | undefined }) {
        this.universities = unpackCookie(cookies[FilterState.COOKIE_UNIVERSITIES])
        this.institutes = unpackCookie(cookies[FilterState.COOKIE_INSTITUTES])
        this.cathedras = unpackCookie(cookies[FilterState.COOKIE_CATHEDRAS])
        this.positions = unpackCookie(cookies[FilterState.COOKIE_POSITIONS])
        this.publishers = unpackCookie(cookies[FilterState.COOKIE_PUBLISHERS])
        this.publicationYears = unpackCookie(cookies[FilterState.COOKIE_PUBLICATION_YEARS])
        this.publicationTypes = unpackCookie(cookies[FilterState.COOKIE_PUBLICATION_TYPE])

        // NaN values get converted to `undefined`
        this.ministerialPoints.min = Number(cookies[FilterState.COOKIE_MINISTERIAL_POINTS_MIN]) || undefined
        this.ministerialPoints.max = Number(cookies[FilterState.COOKIE_MINISTERIAL_POINTS_MAX]) || undefined
        this.publicationCount.min = Number(cookies[FilterState.COOKIE_PUBLICATION_COUNT_MIN]) || undefined
        this.publicationCount.max = Number(cookies[FilterState.COOKIE_PUBLICATION_COUNT_MAX]) || undefined
        this.ifScore.min = Number(cookies[FilterState.COOKIE_IF_SCORE_MIN]) || undefined
        this.ifScore.max = Number(cookies[FilterState.COOKIE_IF_SCORE_MAX]) || undefined
        this.name = cookies[FilterState.COOKIE_NAME]
        this.surname = cookies[FilterState.COOKIE_SURNAME]
    }

    static readonly COOKIE_UNIVERSITIES: string = "universities"
    static readonly COOKIE_INSTITUTES: string = "institutes"
    static readonly COOKIE_CATHEDRAS: string = "cathedras"
    static readonly COOKIE_POSITIONS: string = "positions"
    static readonly COOKIE_IF_SCORE_MIN: string = "ifScoreMin"
    static readonly COOKIE_IF_SCORE_MAX: string = "ifScoreMax"
    static readonly COOKIE_PUBLISHERS: string = "publishers"
    static readonly COOKIE_MINISTERIAL_POINTS_MIN: string = "ministerialPointsMin"
    static readonly COOKIE_MINISTERIAL_POINTS_MAX: string = "ministerialPointsMax"
    static readonly COOKIE_PUBLICATION_COUNT_MIN: string = "publicationCountMin"
    static readonly COOKIE_PUBLICATION_COUNT_MAX: string = "publicationCountMax"
    static readonly COOKIE_PUBLICATION_YEARS: string = "publicationYears"
    static readonly COOKIE_PUBLICATION_TYPE: string = "publicationType"
    static readonly COOKIE_NAME: string = "name"
    static readonly COOKIE_SURNAME: string = "surname"
}

function unpackCookie<T>(cookie: string | undefined): Set<T> {
    try {
        return new Set(JSON.parse(decodeURI(cookie ?? "[]")) as T[])
    } catch(ex) {
        console.log(ex)
        return new Set()
    }
}

function packCookieSet<T>(cookies: Set<T>): string {
    return JSON.stringify(cookies.values().toArray())
}