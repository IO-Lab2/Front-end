'use client'

import {Organization} from "@/lib/API";
import {MouseEventHandler, useContext} from "react";
import {ContrastState} from "@/components/Toolbar";

export interface OrganizationCellProps {
    org: Organization,
    onClick?: MouseEventHandler<HTMLDivElement>
}

export function OrganizationCell(props: OrganizationCellProps) {
    const highContrastMode = useContext(ContrastState)

    return (
        <div
            className={
                `p-2 h-32 basis-1/3 flex-1 content-center text-center odd:bg-black/30 cursor-pointer`
            }
            onClick={props.onClick}
        >
            <span className={`${highContrastMode ? "text-white" : "text-basetext"} text-2xl font-[600]`}>{props.org.name}</span>
        </div>
    )
}