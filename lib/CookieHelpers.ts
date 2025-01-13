export function unpackCookie<T>(cookie: string | undefined): Set<T> {
    if(!cookie) return new Set<T>();

    try {
        return new Set(JSON.parse(decodeURIComponent(cookie) ?? "[]") as T[])
    } catch(ex) {
        console.error(`(${cookie}) ${ex}`)
        return new Set()
    }
}

export function unpackArrayCookie<T>(cookie: string | undefined): T[] {
    if(!cookie) return []

    try {
        return (JSON.parse(decodeURIComponent(cookie) ?? "[]") as T[])
    } catch(ex) {
        console.error(`(${cookie}) ${ex}`)
        return []
    }
}

export function packCookieArray<T>(cookies: T[]): string {
    return JSON.stringify(cookies)
}

export function packCookieSet<T>(cookies: Set<T>): string {
    return JSON.stringify(cookies.values().toArray())
}
