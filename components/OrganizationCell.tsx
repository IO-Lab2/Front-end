'use client'

import {Organization} from "@/lib/API";
import {MouseEventHandler} from "react";

export interface OrganizationCellProps {
    org: Organization,
    onClick?: MouseEventHandler<HTMLDivElement>
}

export function OrganizationCell(props: OrganizationCellProps) {
    return (
        <div
            className={
                `p-2 h-32 basis-1/3 flex-1 content-center text-center odd:bg-black/30 cursor-pointer`
            }
            onClick={props.onClick}
        >
            <span className={`text-basetext text-2xl font-[600]`}>{props.org.name}</span>
        </div>
    )
}