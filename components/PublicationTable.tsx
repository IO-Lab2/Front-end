'use client'

import {Publication} from "@/lib/API";

export interface PublicationTableProps {
    publications: Publication[]
}

export default function PublicationTable(props: PublicationTableProps) {
    return <div className={`p-6`}>
        <div className={`p-4 bg-black/80 rounded-t-2xl text-basetext text-center text-2xl font-bold`}>
            Publikacje ({props.publications.length}):
        </div>
        <div>
            {props.publications.map((publication) => {
                const publicationYear = new Date(publication.publication_date).getFullYear()

                return <div
                    key={publication.id}
                    className={
                        `p-4 pl-8 pr-8 odd:bg-white/30 even:bg-white/60 last:rounded-b-2xl flex flex-col gap-2`
                    }
                >
                    <p className={`text-2xl font-semibold`}>
                        <span className={`text-black/80 underline`}>
                            {publication.title}
                        </span>
                        <span className={`text-bluetext ml-2 mr-2`}>&#8226;</span>
                        <span className={`text-bluetext`}>
                            {publicationYear}
                        </span>
                    </p>
                    <p className={`text-lg font-semibold text-bluetext`}>
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
                    {
                        publication.publisher
                            ? (
                                <p className={`text-lg text-black/80 font-semibold`}>
                                    {publication.publisher}
                                </p>
                            )
                            : null
                    }
                </div>
            })}
        </div>
    </div>
}