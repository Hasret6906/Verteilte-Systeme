import zweia from "../zweia.js";

/**
 
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Kurse
 */
export async function search(query) {
    let result = zweia.db.data.Kurse;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.Bezeichnung.toLowerCase().includes(query)
            
        });
    }

    return result;
}

/**
 * Anlegen eines neuen Kurses.
 * 
 * @param {Object} kurs Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(kurs) {
    if (!kurs) return;

    let entry = {
        id:       zweia.getNextId(zweia.db.data.Kurse),
        Bezeichnung: `${kurs.Bezeichnung || ""}`.trim(),
        
    };

    validateSnippet(entry);
    zweia.db.data.Kurs.push(entry);
    await zweia.db.write();

    return entry;
}

/**
 * Auslesen eines Kurses anhand seiner ID.
 * 
 * @param {integer} id 
 * @returns {Promise<Object>} 
 */
export async function read(id) {
    let index = zweia.findIndex(zweia.db.data.Kurse, parseInt(id));
    if (index >= 0) return zweia.db.data.Kurse[index];
}

/**
 * Aktualisieren eines Kurses durch Überschreiben einzelner Felder
 * oder des gesamten Kurs-Objekts.
 * 
 * @param {integer} id Kurs ID
 * @param {Object} kurs Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, kurs) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (kurs.Bezeichnung)     existing.name     = `${kurs.Bezeichnung}`.trim();
    

    validateSnippet(existing);
    await zweia.db.write();

    return existing;
}

/**
 * Löschen eines Kurses anhand seiner ID.
 * 
 * @param {integer} id Kurs ID
 * @returns {Promise<integer>} 
 */
export async function remove(id) {
    let countBefore = zweia.db.data.Kurse.length;
    zweia.db.data.Kurs = zweia.db.data.Kurse.filter(entry => entry.id !== parseInt(id));
    let countAfter = zweia.db.data.Kurse.length;

    await zweia.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Kurses. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Kurs fehlt").
 * 
 * @param {Object} kurs Zu prüfender Kurs
 */
function validateSnippet(kurs) {
    if (!kurs.Bezeichnung) throw new Error("Kurs fehlt");
} 

    

export default {search, create, read, update, remove};
