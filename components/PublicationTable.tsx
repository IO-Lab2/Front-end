'use client'

import {Publication} from "@/lib/API";
import {useContext} from "react";
import {ContrastState} from "@/components/Toolbar";

export interface PublicationTableProps {
    publications: Publication[]
}

export default function PublicationTable(props: PublicationTableProps) {
    const highContrastMode = useContext(ContrastState)

    return <div>
        <div className={`p-4 ${props.publications.length > 0 ? "rounded-t-2xl" : "rounded-2xl"} ${highContrastMode ? "bg-black text-white" : "bg-black/80 text-basetext"} text-center text-2xl font-bold`}>
            Publikacje ({props.publications.length}):
        </div>
        <div>
            {props.publications.map((publication) => {
                const publicationYear = publication.publication_date ? new Date(publication.publication_date).getFullYear() : undefined

                return <div
                    key={publication.id}
                    className={
                        `p-4 pl-8 pr-8 odd:bg-white/30 even:bg-white/60 last:rounded-b-2xl flex flex-col gap-2 ${highContrastMode ? "border-2 border-black" : ""}`
                    }
                >
                    <p className={`text-2xl font-semibold`}>
                        <span className={`text-black/80 underline`}>
                            {publication.title}
                        </span>
                        {
                            publicationYear
                                ? <>
                                    <span className={`${highContrastMode ? "text-black" : "text-bluetext"} ml-2 mr-2`}>&#8226;</span>
                                    <span className={`${highContrastMode ? "text-black" : "text-bluetext"}`}>{publicationYear}</span>
                                </>
                                : null
                        }
                    </p>
                    <p className={`text-lg font-semibold ${highContrastMode ? "text-black/80" : "text-bluetext"}`}>
                        <span>{publication.journal}</span>
                        {
                            publication.journal_type
                                ? <>
                                    <span className={`ml-2 mr-2`}>&#8226;</span>
                                    <span>{publication.journal_type}</span>
                                </>
                                : null
                        }
                    </p>
                    <div className={`flex text-lg text-black/80 font-semibold`}>
                        <p className={`flex-1`}>
                            {
                                publication.publisher
                                    ? `Wydawca: ${publication.publisher ?? ""}`
                                    : null
                            }
                        </p>
                        <p className={`flex-1 text-right`}>
                            Impact Factor: {publication.impact_factor ?? 0}
                        </p>
                    </div>
                </div>
            })}
        </div>
    </div>
}