// FIXME: Layout breaks on small displays, fonts and contents need to be resized and probably a min-size needs to be set

export default function Home() {
  return (
    <div className={`w-4/6 h-fit m-auto`}>
        <div className={`mb-5`}>
            <div>
                <h1 className={`font-playfair font-extrabold text-black text-center text-8xl`}>
                    Akademicka Baza Wiedzy
                </h1>
            </div>
            <div>
                <h4 className={`font-playfair font-extrabold text-black text-center text-2xl`}>
                    Twoje centrum wiedzy akademickiej - znajdź publikacje, profesorów i badania w jednym miejscu!
                </h4>
            </div>
        </div>
        <div className={`p-5 mb-5 h-60 font-[600] text-center`}>
            <div className={`bg-black h-1/3 text-white content-center text-2xl rounded-t-3xl`}>
                Na początku wybierz uczelnię:
            </div>
            <div className={`bg-black/80 h-2/3 flex text-basetext rounded-b-3xl cursor-pointer text-2xl`}>
                <div className={`p-2 flex-1 bg-black/20 content-center rounded-bl-3xl`}>
                    Szkoła Główna Gospodarstwa Wiejskiego
                </div>
                <div className={`p-2 flex-1 content-center`}>
                    Politechnika Warszawska
                </div>
                <div className={`p-2 flex-1 bg-black/20 content-center rounded-br-3xl`}>
                    Politechnika Białostocka
                </div>
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
  );
}
