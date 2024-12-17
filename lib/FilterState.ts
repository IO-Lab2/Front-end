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
    }

    getCookies(): Map<string, string> {
        const result = new Map<string, string>()

        result.set(FilterState.COOKIE_UNIVERSITIES, packCookieSet(this.universities))
        result.set(FilterState.COOKIE_INSTITUTES, packCookieSet(this.institutes))
        result.set(FilterState.COOKIE_CATHEDRAS, packCookieSet(this.cathedras))

        return result
    }

    static readonly COOKIE_UNIVERSITIES: string = "universities"
    static readonly COOKIE_INSTITUTES: string = "institutes"
    static readonly COOKIE_CATHEDRAS: string = "cathedras"
    static readonly COOKIE_MINISTERIAL_POINTS_MIN: string = "ministerialPointsMin"
    static readonly COOKIE_MINISTERIAL_POINTS_MAX: string = "ministerialPointsMax"
    static readonly COOKIE_PUBLICATION_COUNT_MIN: string = "publicationCount"
    static readonly COOKIE_PUBLICATION_COUNT: string = "publicationCount"
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