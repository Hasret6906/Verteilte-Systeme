import {JSONFilePreset} from "lowdb/node";

// Default-Daten für unsere kleine Datenbank
const defaultData = {
    Schueler: [
        {
            id: 1,
            nachname: "Mueller",
            vorname: "Lisa",
        },

        {
            id: 2,
            nachname: "Yilmaz",
            vorname: "Emir",
        },
        {
            id: 3,
            nachname: "Mustermann",
            vorname: "Kenan",
        }
    ],

    Kurse: [
        {
            id:       1,
            Bezeichnung: "Vwl"
        },
        {
            id:       2,
            Bezeichnung: "Programmierung"
        },
        {
            id:       3,
            Bezeichnung: "Statistik"
        }
    ],
    Lehrer:[
        {
            id:1,
            nachname:"Weber",
            vorname:"Andreas"
        },
        {
            id:2,
            nachname:"Oehmig",
            vorname:"Romana"
        },
        {
            id:3,
            nachname:"Adolf",
            vorname:"Olaf"
        }
    ]
};
export const db = await JSONFilePreset("db.json", defaultData);

/**
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 * @param {integer} id ID des gesuchten Datensatzes
 * @returns {integer} Gefundener Index oder -1
 */
export function findIndex(dataset, id) {
    return dataset.findIndex(entry => entry.id === id);
}

/**
 * 
 * 
 * @param {Object[]} dataset Zu durchsuchende Datenmenge
 */
export function getNextId(dataset) {
    let maxId = -1;
    for (let entry of dataset || []) maxId = Math.max(maxId, entry.id);
    return maxId + 1;
}

export default {db, findIndex, getNextId};
