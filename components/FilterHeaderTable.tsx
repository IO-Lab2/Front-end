'use client'

import {fetchGetOrganizationsTree, OrganizationBody} from "@/lib/API";
import {OrganizationCell} from "@/components/OrganizationCell";
import {useEffect, useState} from "react";
import {UUID} from "node:crypto";

export interface FilterTableProps {
    header?: string,
    parentOrg?: UUID,
    onChoice?: (org: OrganizationBody) => void
}

export default function FilterHeaderTable(props: FilterTableProps) {
    const [orgs, setOrgs] = useState<OrganizationBody[] | null>(null);

    useEffect(() => {
        (async function() {
            const fetchedOrgs = await fetchGetOrganizationsTree(props.parentOrg ?? null) ?? []
            setOrgs(fetchedOrgs)
        })()
    }, [props.parentOrg]) // Note to self - don't put `orgs` in this array if you don't want to get stuck in a loop and get rate-limited by the API server (oops)

    const onChoiceCallback = props.onChoice

    return (
        <div className={`m-10 rounded-3xl overflow-clip`}>
            <div className={`h-20 bg-black text-center content-center`}>
                <span className={`font-[600] text-white text-2xl`}>{props.header ?? ""}</span>
            </div>
            <div className={`flex flex-wrap min-h-32 bg-black/80`}>
                {
                    // FIXME: fails if the fetch request returns anything other than an array
                    (orgs ?? []).flatMap(org => {
                        // prob needs more error handling
                        return <OrganizationCell
                            key={org.id}
                            org={org}
                            onClick={onChoiceCallback ? () => onChoiceCallback(org) : undefined}
                        />
                    })
                }
            </div>
        </div>
    )
}