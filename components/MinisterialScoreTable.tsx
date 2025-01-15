'use client'

import {PublicationScore} from "@/lib/API";
import {JSX, useContext, useMemo} from "react";
import {ContrastState} from "@/components/Toolbar";

export interface MinisterialScoreTableProps {
    total?: number
    scores: PublicationScore[]
}

export default function MinisterialScoreTable(props: MinisterialScoreTableProps) {
    const highContrastMode = useContext(ContrastState)

    const scores: JSX.Element[] = useMemo(() => {
        const total = props.scores.reduce((total, score) => {
            return total + (score.score || 0)
        }, 0)

        return props.scores
            .filter((score) => Boolean(score.year && score.score))
            .sort((left, right) => {
                return (Number(right.year) || 0) - (Number(left.year) || 0)
            })
            .concat([{ score: total, year: "Razem" }])
            .map(({score, year}) => {
                return <div key={year}
                    className={
                        `flex-1 odd:bg-white/50 even:bg-white/70 p-1 first:rounded-bl-2xl last:rounded-br-2xl ${highContrastMode ? "border border-black" : ""}`
                    }
                >
                    <p className={`text-center font-semibold text-black/80 text-xl underline`}>
                        {year}
                    </p>
                    <p className={`text-center ${highContrastMode ? "text-black" : "text-bluetext"} font-semibold text-2xl`}>
                        {score}
                    </p>
                </div>
            })
    }, [highContrastMode, props.scores])

    return <div>
        <div className={`p-4 ${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext"} rounded-t-2xl text-basetext text-center text-2xl font-bold`}>
            Punkty ministerialne:
        </div>
        <div className={`flex`}>
            {scores}
        </div>
    </div>
}
