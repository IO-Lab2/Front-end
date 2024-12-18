export interface ScientistCellProps {
    title: string
    name: string
    researchArea: string
    institute: string
    cathedra: string
}

export function ScientistCell(props: ScientistCellProps) {
    return (
        <div className="p-12 w-full h-72 even:bg-white/30 flex gap-4">
            <div className={`w-60 flex-shrink-0 flex content-center justify-center`}>
                <div className={`bg-black m-auto h-full aspect-square`}></div>
            </div>
            <div className={`flex-1 flex flex-col font-[600]`}>
                <div className={`w-full flex-1 flex flex-col gap-1`}>
                    <p className={`text-2xl`}>
                        <span className={`text-gray-800/80`}>{props.title}</span> <span className={`text-3xl`}>{props.name}</span>
                    </p>
                    <p className={`text-xl text-gray-800/80`}>{props.researchArea}</p>
                </div>
                <div className={`w-full flex-1 flex flex-col place-content-end gap-2`}>
                    <p className={`text-xl w-fit underline text-bluetext cursor-pointer`}>{props.cathedra}</p>
                    <p className={`text-xl w-fit underline text-bluetext cursor-pointer`}>{props.institute}</p>
                </div>
            </div>
        </div>
    )
}