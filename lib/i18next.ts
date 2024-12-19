import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
    fallbackLng : 'en',
    resources: {
        en: {
            translation: {  //Changed - zmieniona nazwa
                
                //Głowna strona--------------------------------
                title: "Academic knowledge database",
                subtitle: "Your centre of academic knowledge - find publications, professors and researches, all in one place!",
                choose1: "Choose a university",
                choose2: "Choose an institute",
                skip: "Skip",
                
                //Filtry---------------------------------------
                uni: "University",
                institue: "Institute",
                cathedral: "Department",
                pos: "Position",
                numofpub: "Number of publications",
                numofpoints: "number of ministerial points",
                if: "IF factor",
                publisher: "Publisher",
                years: "Years of publication",
                type: "Type of publication",

                //Reszta przy filtrach
                found: "Found "+""+" matching results",
                refresh: "Refresh",
                sortby: "Sort by:",
                name: "Last name/First name",
                rev: "Relevancy",
                aff: "Affiliation",

                //Dziedziny------------------------------------
                greece: "Philosophy",
                archurb: "Architecture and urban planning",
                autoeleele: "Automation, electronic and electrical engineering", //Changed
                infocom: "Information and communication technology",
                bioengi: "Biomedical engineering",
                walterwhite: "Chemical engineering",
                civ: "Civil engineering and transport", //Changed
                material: "Materials engineering",
                mech: "Mechanical engineering",
                environment: "environmental engineering, mining and energy",
                forest: "Forestry",
                agrhor: "Agriculture and horticulture",
                food: "Nutrition and food technology",
                vet: "Veterinary science",
                fish: "Animal science and fisheries",
                billgates: "Economics and finance",
                manager: "Managmet and quality studies",
                AceAttorney: "Law",
                sociology: "Sociology",
                edu: "Education",
                math: "Mathematics",
                biology: "Biological sciences",
                chemistry: "Chemical sciences",
                physics: "Physical sciences",
                art: "Fine arts and art conservation",

                //Profil-------------------------------------
                numofpoints2: "Ministerial points",
                disc: "Disciplines",
                pub: "Publications:",
                original: "University database profile",
                comparedotdotdot: "Compare with...",

                //Porównaj-----------------------------------
                comparewith: "Compare with:",
                compare: "Compare",
                chosen: "(Chosen "+""+" out of max. 9)",

                //tba-------------------------------------
            }
        },
        pl: {
            translation: {  //Changed - zmieniona nazwa
                
                //Głowna strona--------------------------------
                title: "Akademicka baza wiedzy",
                subtitle: "Twoje centrum wiedzy akademickiej - znajdź publikacje, profesorów i badania w jednym miejscu!",
                choose1: "Na początku wybierz uczelnię:",
                choose2: "Wybierz instytut: ",
                skip: "Pomiń",
                
                //Filtry---------------------------------------
                uni: "Uczelnia",
                institue: "Instytut",
                cathedral: "Katedra",
                pos: "Stanowisko",
                numofpub: "Ilość publikacji",
                numofpoints: "Ilość punktów ministerialnych",
                if: "Współczynnik IF",
                publisher: "Wydawca",
                years: "Lata publikacji",
                type: "Rodzaj publikacji",

                //Reszta przy filtrach
                found: "Znaleziono "+""+" wyników wyszukiwania",
                refresh: "Odśwież wyniki",
                sortby: "Sortuj według:",
                name: "Nazwisko/Imię",
                rev: "Relewantność",
                aff: "Afiliacja",

                //Dziedziny------------------------------------
                greece: "Filozofia",
                archurb: "Architektura i urbanistyka",
                autoeleele: "Automatyka, elektronika i elektrotechnika", //Changed
                infocom: "Informatyka techniczna i telekomunikacja",
                bioengi: "Inżynieria biomedyczna",
                walterwhite: "Inżynieria chemiczna",
                civ: "Inżynieria lądowa i transport", //Changed
                material: "Inżynieria materiałowa",
                mech: "Inżynieria mechaniczna",
                environment: "Inżynieria środowiska, górnictwo i energetyka",
                forest: "Nauki leśne",
                agrhor: "Rolnictwo i ogrodnictwo",
                food: "Technologia żywności i żywienia",
                vet: "Weterynaria",
                fish: "Zootechnika i rybactwo",
                billgates: "Ekonomia i finanse",
                manager: "Nauki o zarządzaniu i jakości",
                AceAttorney: "Nauki prawne",
                sociology: "Nauki socjologiczne",
                edu: "Pedagogika",
                math: "Matematyka",
                biology: "Nauki biologiczne",
                chemistry: "Nauki chemiczne",
                physics: "Nauki fizyczne",
                art: "Sztuki plastyczne i konserwacja dzieł sztuki",

                //Profil-------------------------------------
                numofpoints2: "Punkty ministerialne",
                disc: "Dyscypliny",
                pub: "Publikacje:",
                original: "Profil w bazie danych uczelni",
                comparedotdotdot: "Porównaj z...",

                //Porównaj-----------------------------------
                comparewith: "Porównaj z:",
                compare: "Porównaj",
                chosen: "(Wybrano "+""+" z max. 9)",

                //tba-------------------------------------
                tba: "tba"
            }
        }
    }
})