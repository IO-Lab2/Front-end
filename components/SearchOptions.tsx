'use client'

export enum SortMethod {
    Organization,
    IFDescending,
    IFAscending,
    MinisterialPointsDescending,
    MinisterialPointsAscending
}

export interface SearchOptionsProps {
    pageCount?: number,
    selectedPage?: number,
    onPageChange?: (page: number) => void,
    onRefresh?: () => void,
    onSortMethodChange?: (sortMethod: SortMethod) => void,
    onFilterReset?: () => void,
    canResetFilters?: boolean,
    isSearchInProgress?: boolean,
    compareCount?: number,
    compareLimit?: number,
    onCompare?: () => void,
    onResetCompare?: () => void,
}

export function SearchOptions(props: SearchOptionsProps) {
    const onRefresh = props.onRefresh
    const onFilterReset = props.onFilterReset
    const onPageChange = props.onPageChange
    const onCompare = props.onCompare
    const onResetCompare = props.onResetCompare

    // TODO Sorting Options
    // const onSortMethodChange = props.onSortMethodChange

    const buttonNoRound = `text-center content-center text-basetext font-bold text-xl`
    const buttonCommon = `rounded-2xl ${buttonNoRound}`
    const disabledButton = `cursor-default text-gray-300 opacity-40`

    const canResetFilters = props.canResetFilters ?? false
    const selectedPage = props.selectedPage ?? 1
    const pageCount = props.pageCount ?? 1
    const hasPrevPage = selectedPage > 1
    const hasNextPage = selectedPage < pageCount
    const compareCount = props.compareCount ?? 0

    const enableButtons = !props.isSearchInProgress
    const enableCompare = enableButtons && compareCount > 1

    return (
        <div className={`flex flex-col gap-4`}>
            <div className={`flex gap-6`}>
                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableButtons ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onRefresh) ? () => onRefresh() : undefined}
                >
                    Odśwież Wyniki
                </div>
                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableCompare ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableCompare && onCompare) ? () => onCompare() : undefined}
                >
                    Porównaj ({compareCount ?? 0}{props.compareLimit ? `, max ${props.compareLimit}` : ""})
                </div>
                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableButtons ? "cursor-pointer" : disabledButton}`}>
                    Sortuj Według:
                </div>
            </div>

            <div className={`flex gap-6`}>
                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableButtons && canResetFilters ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onFilterReset && canResetFilters) ? () => onFilterReset() : undefined}
                >
                    Resetuj Filtry
                </div>

                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableButtons && (compareCount > 0) ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && (compareCount > 0) && onResetCompare) ? () => onResetCompare() : undefined}
                >
                    Resetuj Porównywanie
                </div>
            </div>

            <div className={`flex gap-2`}>
                <div
                    className={`w-12 h-12 ${buttonCommon} bg-black/80 ${(hasPrevPage && enableButtons) ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onPageChange && hasPrevPage) ? () => onPageChange(1) : undefined}
                >
                    &lt;&lt;
                </div>
                <div
                    className={`w-12 h-12 ${buttonCommon} bg-black/80 ${(hasPrevPage && enableButtons) ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onPageChange && hasPrevPage) ? () => onPageChange(selectedPage - 1) : undefined}
                >
                    &lt;
                </div>
                <div className={`flex cursor-default`}>
                    <div className={`h-12 p-2 ${buttonNoRound} bg-black/80 rounded-l-2xl`}>
                        Strona
                    </div>
                    <div className={`h-12 p-2 min-w-10 ${buttonNoRound} rounded-r-2xl bg-black/70`}>
                        {selectedPage} / {pageCount}
                    </div>
                </div>
                <div
                    className={`w-12 h-12 ${buttonCommon} bg-black/80 ${(hasNextPage && enableButtons) ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onPageChange && hasNextPage) ? () => onPageChange(selectedPage + 1) : undefined}
                >
                    &gt;
                </div>
                <div
                    className={`w-12 h-12 ${buttonCommon} bg-black/80 ${(hasNextPage && enableButtons) ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onPageChange && hasNextPage) ? () => onPageChange(pageCount) : undefined}
                >
                    &gt;&gt;
                </div>
            </div>
        </div>
    )
}

