import {ApiClient, fromCatalog} from "@opendatasoft/api-client";

const client = new ApiClient({domain: "opendata.paris.fr"});
document.querySelector(".preload").style.display = "none";

console.log(rue);

// Initialise la carte google maps

let map;
let service;
let infowindow;


function initMap() {
    const paris = new google.maps.LatLng(48.858967788675294, 2.3549314224156106);

    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: paris,
        zoom: 15,
    });


}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}

window.initMap = initMap;



const formEL = document.getElementById("input-rue");

// Tout commence ici, lorsque le submit est envoyé

formEL.addEventListener('submit', async (e) => {
    window.initMap = initMap;
    e.preventDefault();


// Récupération de la valeur de l'input

    const rue = document.getElementById('rue').value;

    // Crée la requête avec la valeur de la rue

    const query = fromCatalog()
        .dataset("eclairage-public")
        .aggregates()
        .select("count(lib_voie) as lampadaires")
        .groupBy("lib_voie as rue, lib_region as arrondissement")
        .where(`lib_voie like '${rue}'`)
        .toString();

    const query2 = fromCatalog()
        .dataset("voie")
        .aggregates()
        .select("sum(length) as longueur")
        .groupBy("l_longmin as rue")
        .where(`l_longmin like '${rue}'`)
        .toString();

    // Exécute la requête
    client
        .get(query)
        .then(({aggregations}) => {
            console.log(aggregations);
            const lampadairesEl = document.getElementById("lampadaires");
            const delitsCrimesEL = document.getElementById("delitsCrimes");
            const ratioEl = document.getElementById("ratio");
            console.log(aggregations.length);


            // Si la longueur de la réponse est de 0... alors c'est qu'aucune voie n'a été trouvée !

            if (aggregations.length === 0) {
                lampadairesEl.innerHTML = "Aucune voie trouvée dans Paris.";
                delitsCrimesEL.innerHTML = "";
                ratioEl.innerHTML = "";
            } else {
                const nombreLampadaires = aggregations[0].lampadaires;
                const nomRue = aggregations[0].rue;
                const arrondissement = aggregations[0].arrondissement;

                // Récupère le numéro de l'arrondissement de la voie dans la première base de données

                const numArdt = parseInt(arrondissement.slice(15))

                ;
                // Va chercher les valeurs correspondant à cet arrondissement dans la seconde base de données
                fetch("./src/server/DataDelitsCrimes.json").then((response) => response.json())
                    .then((arrondissements) => getIncidents(arrondissements));

                const getIncidents = (arrondissement) => {
                    const zipcodes = arrondissement.filter((rue) => parseInt(rue.zipcode) === 75100 + numArdt)
                        .flatMap(rue => [rue.classe, rue.faits])
                    console.log(zipcodes);

                    // Calcule la somme des délits et crimes par arrondissement

                    let sommeDelitsCrimesArdt = 0;
                    for (let i = 0;
                         i < zipcodes.length; i++) {
                        const el = zipcodes[i];
                        if (!(i % 2 === 0)) {
                            sommeDelitsCrimesArdt += el;
                        }
                    }
                    console.log(sommeDelitsCrimesArdt);

                    // Calcule la somme des délits et crimes dans Paris

                    const totalDelitsCrimes = arrondissement.filter((rue) => parseInt(rue.zipcode) > 75100 && parseInt(rue.zipcode) <= 75120)
                        .flatMap(rue => [rue.classe, rue.faits])
                    console.log(totalDelitsCrimes);
                    let sommeTotalDelitsCrimes = 0;
                    for (let i = 0;
                         i < totalDelitsCrimes.length; i++) {
                        const el = totalDelitsCrimes[i];
                        if (!(i % 2 === 0)) {
                            sommeTotalDelitsCrimes += el;
                        }
                    }
                    console.log(sommeTotalDelitsCrimes);
                    // Calcule la proportion des délits et crimes de l'arrondissement

                    const proportionDelitsCrimesArdt = Math.round((parseInt(sommeDelitsCrimesArdt) / parseInt(sommeTotalDelitsCrimes)) * 100)

                    // Affiche les données sur le site

                    lampadairesEl.innerHTML = `Selon les informations fournies par la ville de Paris, il y a <span style="color:#1de9b6; font-weight:600">${nombreLampadaires}</span> lampadaires à <span style="color:#1de9b6; font-weight:600">${nomRue}</span>.`;
                    delitsCrimesEL.innerHTML = `Dans le <span style="color:#1de9b6; font-weight:600">${numArdt}ème</span> arrondissement où se situe cette voie, il y a eu <span style="color:#1de9b6; font-weight:600">${sommeDelitsCrimesArdt}</span> délits et crimes en 2022, soit <span style="color:#1de9b6; font-weight:600">${proportionDelitsCrimesArdt}%</span> des délits et crimes enregistrées à Paris pour la même période. `;
                    client
                        .get(query2)
                        .then(({aggregations}) => {
                            console.log(aggregations);
                            console.log(aggregations.length)
                            const longueurRue = aggregations[0].longueur;
                            console.log(longueurRue);
                            const ratioLampadairesLongueurRue = Math.round((1/(nombreLampadaires/longueurRue)));
                            console.log(ratioLampadairesLongueurRue)
                            if (ratioLampadairesLongueurRue<=20) {
                                ratioEl.innerHTML = `Il y a un lampadaire tous les <span style="color:#1de9b6; font-weight:600">${ratioLampadairesLongueurRue} mètres</span> ! La rue est bien éclairée :)`
                            }
                            else {
                                ratioEl.innerHTML = `Il y a un lampadaire tous les <span style="color:#1de9b6; font-weight:600">${ratioLampadairesLongueurRue} mètres</span> ! Peut mieux faire... :(`
                            }
                        })


                };
                console.log(numArdt);
                // Localise la rue sur la carte Google Maps
                service = new google.maps.places.PlacesService(map);
                const request = {
                    query: nomRue,
                    fields: ["name", "geometry"],
                };

                service = new google.maps.places.PlacesService(map);
                service.findPlaceFromQuery(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                        for (let i = 0; i < results.length; i++) {
                            createMarker(results[i]);
                        }

                        map.setCenter(results[0].geometry.location);
                    }
                });
            }


        })



    document.querySelector(".preload").style.display = "block";

    // Appelle le script du backend

    try {

        const resultElement = document.getElementById('freqVoie');
        resultElement.innerHTML = ``;
        const response = await fetch('/getFreq?rue=' + encodeURIComponent(rue));

        const data = await response.json();

        resultElement.innerHTML = `Selon les informations fournies par Google Maps, il semble que la voie soit actuellement <span style="color:#1de9b6; font-weight:600">${data.freqVoie}</span>.`;
        document.querySelector(".preload").style.display = "none";

    } catch (error) {
        const resultElement = document.getElementById('freqVoie');
        resultElement.innerHTML = ``;
        console.error(error);
        resultElement.innerHTML = '<p>Une erreur est survenue lors de la récupération des données.</p>';
        document.querySelector(".preload").style.display = "none";
    }
    console.log(rue);
    fetch(request)


});
