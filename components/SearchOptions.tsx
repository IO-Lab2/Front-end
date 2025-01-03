'use client'

export enum SortMethod {
    Organization,
    IFDescending,
    IFAscending,
    MinisterialPointsDescending,
    MinisterialPointsAscending
}

export interface SearchOptionsProps {
    onRefresh?: () => void,
    onSortMethodChange?: (sortMethod: SortMethod) => void,
    onFilterReset?: () => void,
    canResetFilters?: boolean,
}

export function SearchOptions(props: SearchOptionsProps) {
    const onRefresh = props.onRefresh
    const onFilterReset = props.onFilterReset
    const canResetFilters = props.canResetFilters ?? false

    // TODO Sorting Options
    // const onSortMethodChange = props.onSortMethodChange

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
            <div
                className={
                    `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl cursor-pointer`
                }
            >
                Sortuj Według:
            </div>
            <div
                className={
                    `w-60 h-12 rounded-2xl text-center content-center text-basetext bg-black/80 font-bold text-xl
                    ${canResetFilters ? "cursor-pointer italic" : "cursor-default" }`
                }
                onClick={(onFilterReset && canResetFilters) ? () => onFilterReset() : undefined}
            >
                Resetuj Filtry
            </div>
        </div>
    )
}

