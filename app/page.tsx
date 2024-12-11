'use client'

// FIXME: Layout breaks on small displays, fonts and contents need to be resized and probably a min-size needs to be set

import FilterHeaderTable from "@/components/FilterHeaderTable";

export default function Home() {
    return (
        <div className={`w-4/6 h-fit m-auto`}>
            <div className={`mt-10 mb-10`}>
                <div className={`mb-5`}>
                    <div>
                        <h1 className={`font-playfair font-extrabold text-black text-center text-8xl`}>
                            Akademicka Baza Wiedzy
                        </h1>
                    </div>
                    <div>
                        <h4 className={`font-playfair font-extrabold text-black text-center text-2xl`}>
                            Twoje centrum wiedzy akademickiej - znajdź publikacje, profesorów i badania w jednym
                            miejscu!
                        </h4>
                    </div>
                </div>

                <FilterHeaderTable
                    header={`Na początku wybierz uczelnię:`}
                    onChoice={(id) => console.log(`Wybrano ${id}`)}
                />
            </div>
        </div>
    );
}
