// FIXME: Layout breaks on small displays, fonts and contents need to be resized and probably a min-size needs to be set

import {InstitutionCell} from "@/components/InstitutionCell";

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
                <div className={`m-10 font-[600] text-center rounded-3xl overflow-clip`}>
                    <div className={`bg-black h-20 text-white content-center text-2xl`}>
                        Na początku wybierz uczelnię:
                    </div>
                    <div className={`flex flex-wrap text-basetext cursor-pointer min-h-32 bg-black/80 text-2xl`}>
                        <InstitutionCell display="Test 1"/>
                        <InstitutionCell display="Test 2"/>
                        <InstitutionCell display="Test 3"/>
                        <InstitutionCell display="Test 4"/>
                        <InstitutionCell display="Test 5"/>
                        <InstitutionCell display="Test 6"/>
                    </div>
                </div>
                <div className={`flex justify-center`}>
                    <div className={
                        `w-52 h-16 m-0 bg-black font-[600] text-2xl text-white text-center content-center cursor-pointer rounded-3xl`
                    }>
                        Pomiń {`>`}
                    </div>
                </div>
            </div>
        </div>
    );
}
