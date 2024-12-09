export function InstitutionCell({display}: {
    display: string
}) {
    return (
        <div className={
            `p-2 h-32 basis-1/3 flex-1 text-basetext content-center odd:bg-black/30`
        }>
            {display}
        </div>
    )
}