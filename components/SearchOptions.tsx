'use client'

export interface SearchOptionsProps {
    onRefresh?: () => void
}

export function SearchOptions(props: SearchOptionsProps) {
    const onRefresh = props.onRefresh

    return (
        <div className={`flex gap-6`}>
            <div
                className={
                    `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
                }
                onClick={onRefresh ? () => onRefresh() : undefined}
            >
                Odśwież Wyniki
            </div>
            <div className={
                `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
            }>
                Sortuj Według:
            </div>
        </div>
    )
}

