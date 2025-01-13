'use client'

import React, {createContext} from "react";
import {CONTRAST_ICON} from "@/components/Icons";

export interface ToolbarProps {
    highContrastMode?: boolean
    onToggleContrast?: () => void
    children?: React.ReactNode
}

export const ContrastState = createContext(false)

export default function Toolbar(props: ToolbarProps) {
    return <div className={`w-screen h-screen ${props.highContrastMode ? "bg-white" : "bg-gradient-to-tr from-primary to-secondary"} bg-fixed flex flex-col`}>
        <div className={`bg-black text-white h-16 p-1 flex gap-1 flex-shrink-0 flex-grow-0`}>
            <div
                className={`p-2 h-full w-auto aspect-square cursor-pointer`}
                onClick={() => { if(props.onToggleContrast) { props.onToggleContrast() } }}
                title={`Kontrast`}
            >
                {CONTRAST_ICON}
            </div>
        </div>
        <div className={`flex justify-center content-center flex-1 overflow-y-scroll`}>
            {props.children}
        </div>
    </div>
}