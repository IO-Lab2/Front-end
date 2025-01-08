export function unpackCookie<T>(cookie: string | undefined): Set<T> {
    try {
        return new Set(JSON.parse(decodeURI(cookie ?? "[]")) as T[])
    } catch(ex) {
        console.log(ex)
        return new Set()
    }
}

export function packCookieSet<T>(cookies: Set<T>): string {
    return JSON.stringify(cookies.values().toArray())
}
