'use client'

export interface SkipFilterButtonProps {
    onClick?: () => void
}

export default function SkipFilterButton(props: SkipFilterButtonProps) {
    return (
        <div className={`flex justify-center`}>
            <div
                className={
                    `w-52 h-16 m-0 bg-black font-[600] text-2xl text-white text-center content-center cursor-pointer rounded-3xl`
                }
                onClick={props.onClick}
            >
                Pomiń {`>`}
            </div>
        </div>
    )
}