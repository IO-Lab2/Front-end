export class FilterState {
    universities: Set<string> = new Set();
    institutes: Set<string> = new Set()
    cathedras: Set<string> = new Set()
    ministerialPoints: {
        min?: number
        max?: number
    } = { }
    publicationCount: {
        min?: number
        max?: number
    } = { }

    readFromCookies(cookies: { [key: string]: string | undefined }) {
        this.universities = unpackCookie(cookies[FilterState.COOKIE_UNIVERSITIES])
        this.institutes = unpackCookie(cookies[FilterState.COOKIE_INSTITUTES])
        this.cathedras = unpackCookie(cookies[FilterState.COOKIE_CATHEDRAS])

        // NaN values get converted to `undefined`
        this.ministerialPoints.min = Number(cookies[FilterState.COOKIE_MINISTERIAL_POINTS_MIN]) || undefined
        this.ministerialPoints.max = Number(cookies[FilterState.COOKIE_MINISTERIAL_POINTS_MAX]) || undefined
        this.publicationCount.min = Number(cookies[FilterState.COOKIE_PUBLICATION_COUNT_MIN]) || undefined
        this.publicationCount.max = Number(cookies[FilterState.COOKIE_PUBLICATION_COUNT_MAX]) || undefined
    }

    getCookies(): Map<string, string> {
        const result = new Map<string, string>()

        result.set(FilterState.COOKIE_UNIVERSITIES, packCookieSet(this.universities))
        result.set(FilterState.COOKIE_INSTITUTES, packCookieSet(this.institutes))
        result.set(FilterState.COOKIE_CATHEDRAS, packCookieSet(this.cathedras))

        if (this.ministerialPoints.min !== undefined) {
            result.set(FilterState.COOKIE_MINISTERIAL_POINTS_MIN, this.ministerialPoints.min.toString())
        }
        if (this.ministerialPoints.max !== undefined) {
            result.set(FilterState.COOKIE_MINISTERIAL_POINTS_MAX, this.ministerialPoints.max.toString())
        }
        if (this.publicationCount.min !== undefined) {
            result.set(FilterState.COOKIE_PUBLICATION_COUNT_MIN, this.publicationCount.min.toString())
        }
        if (this.publicationCount.max !== undefined) {
            result.set(FilterState.COOKIE_PUBLICATION_COUNT_MAX, this.publicationCount.max.toString())
        }

        return result
    }

    static readonly COOKIE_UNIVERSITIES: string = "universities"
    static readonly COOKIE_INSTITUTES: string = "institutes"
    static readonly COOKIE_CATHEDRAS: string = "cathedras"
    static readonly COOKIE_MINISTERIAL_POINTS_MIN: string = "ministerialPointsMin"
    static readonly COOKIE_MINISTERIAL_POINTS_MAX: string = "ministerialPointsMax"
    static readonly COOKIE_PUBLICATION_COUNT_MIN: string = "publicationCountMin"
    static readonly COOKIE_PUBLICATION_COUNT_MAX: string = "publicationCountMax"
}

export class FilterGroup {
    name: string
    values: Set<string>

    constructor(name: string, cookie: string | undefined) {
        this.name = name
        this.values = new Set((cookie ?? "").split("%3A")) // cookies-next converts ':' into '%3A' when inserting data into cookies, i hate this
    }

    getName(): string { return this.name}
    packString(): string {
        return this.values.values().toArray().join(":")
    }
}

function unpackCookie(cookie: string | undefined): Set<string> {
    return new Set((cookie ?? "").split("%3A"))
}

function packCookieSet(cookies: Set<string>): string {
    return cookies.values().toArray().join(":")
}