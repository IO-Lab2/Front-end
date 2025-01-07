import {UUID} from "node:crypto";
import {setCookie} from "cookies-next/client";
import {packCookieSet, unpackCookie} from "@/lib/CookieHelpers";

export class CompareState {
    scientists: Set<UUID> = new Set()

    add(id: UUID): boolean {
        if(this.scientists.size < CompareState.LIMIT) {
            this.scientists.add(id);
            console.log(`Added scientist for comparison: ${id}`)
            return true
        }

        console.log(`Can't add scientist for comparison, reached limit: ${id}`)
        return false
    }

    remove(id: UUID): boolean {
        console.log(`Removed scientist from comparison: ${id}`)
        return this.scientists.delete(id)
    }

    syncCookie() {
        const packed: string = packCookieSet<string>(this.scientists)
        setCookie(CompareState.COOKIE_COMPARE, packed, {
            sameSite: "lax"
        })
    }

    readFromCookies(cookies: { [key: string]: string | undefined}) {
        const cookie = decodeURI(cookies[CompareState.COOKIE_COMPARE] as string).replaceAll("%2C", ",") // HACK: i hate webdev
        console.log(`Cookie ${cookie}`)
        this.scientists = unpackCookie(cookie)
    }

    static readonly COOKIE_COMPARE: string = "compare"
    static readonly LIMIT: number = 4
}

