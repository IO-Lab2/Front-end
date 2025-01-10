'use client'

import {useState} from "react";

export enum SortMethod {
    Name,
    PublicationCount,
    MinisterialPoints
}

export interface SearchOptionsProps {
    pageCount?: number,
    selectedPage?: number,
    sortMethod?: SortMethod,
    canResetFilters?: boolean,
    isSearchInProgress?: boolean,
    compareCount?: number,
    compareLimit?: number,

    onPageChange?: (page: number) => void,
    onRefresh?: () => void,
    onSortMethodChange?: (sortMethod: SortMethod | undefined) => void,
    onFilterReset?: () => void,
    onCompare?: () => void,
    onResetCompare?: () => void,
}

export function SearchOptions(props: SearchOptionsProps) {
    const onRefresh = props.onRefresh
    const onFilterReset = props.onFilterReset
    const onPageChange = props.onPageChange
    const onCompare = props.onCompare
    const onResetCompare = props.onResetCompare

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

    const [sortingTabExpanded, setSortingTabExpanded] = useState(false)

    return (
        <div className={`flex flex-col gap-4`}>
            <div className={`flex gap-6`}>
                <div
                    className={`w-60 h-12 ${buttonCommon} bg-black/80 ${enableButtons ? "cursor-pointer" : disabledButton}`}
                    onClick={(enableButtons && onRefresh) ? () => { setSortingTabExpanded(false); onRefresh() } : undefined}
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
                    className={`w-60 h-12 ${buttonNoRound} bg-black/80 ${enableButtons ? "cursor-pointer" : disabledButton} ${sortingTabExpanded && enableButtons ? "rounded-t-2xl" : "rounded-2xl"}`}
                    onMouseLeave={() => setSortingTabExpanded(false)}
                >
                    <div
                        className={`h-full flex justify-center items-center`}
                        onClick={() => {
                            setSortingTabExpanded(!sortingTabExpanded)
                        }}
                    >
                        <p>Sortuj Według:</p>
                    </div>
                    <div
                        className={
                            `${sortingTabExpanded && enableButtons ? "" : "hidden"} absolute w-60 bg-white border-2
                            border-black/80 text-black/80 bg-clip-padding rounded-b-2xl text-sm`
                        }
                    >
                        <SortOption
                            label={`Nazwisko / Imię`} selected={props.sortMethod === SortMethod.Name} method={SortMethod.Name}
                            onChoice={props.onSortMethodChange}
                        />
                        <SortOption
                            label={`Ilość Publikacji`} selected={props.sortMethod === SortMethod.PublicationCount} method={SortMethod.PublicationCount}
                            onChoice={props.onSortMethodChange}
                        />
                        <SortOption
                            label={`Punkty Ministerialne`} selected={props.sortMethod === SortMethod.MinisterialPoints} method={SortMethod.MinisterialPoints}
                            onChoice={props.onSortMethodChange}
                        />
                    </div>
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

interface SortOptionProps {
    label: string,
    selected: boolean,
    method: SortMethod,
    onChoice?: (sortMethod: SortMethod | undefined) => void,
}

function SortOption(props: SortOptionProps) {
    return <div
        className={`hover:bg-blue-400 p-0.5 last:rounded-b-2xl`}
        onClick={() => { if(props.onChoice) { props.onChoice(props.selected ? undefined : props.method) } }}
    >
        {props.selected ? <b>&#8226; {props.label} &#8226;</b> : <span>{props.label}</span>}
    </div>
}
