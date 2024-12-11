'use client'

export default function SkipFilterButton() {
    return (
        <div className={`flex justify-center`}>
            <div className={
                `w-52 h-16 m-0 bg-black font-[600] text-2xl text-white text-center content-center cursor-pointer rounded-3xl`
            }>
                Pomiń {`>`}
            </div>
        </div>
    )
}