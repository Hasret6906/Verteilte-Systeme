

import zweia from "../zweia.js";

/**
 * 
 * 
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Schueler
 */
export async function search(query) {
    let result = zweia.db.data.Schueler;

    if (query) {
        query = `${query}`.toLowerCase();
        result = result.filter(entry => {
            return entry.nachname.toLowerCase().includes(query)
                || entry.vorname.toLowerCase().includes(query)
                
        });
    }

    return result;
}

/**
 * Anlegen eines neuen Schuelers.
 * 
 * @param {Object} schueler Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(schueler) {
    if (!schueler) return;

    let entry = {
        id:       zweia.getNextId(zweia.db.data.Schueler),
        nachname: `${schueler.nachname || ""}`.trim(),
        vorname:     `${schueler.vorname     || ""}`.trim(),
        
    };

    validateSnippet(entry);
    zweia.db.data.Schueler.push(entry);
    await zweia.db.write();

    return entry;
}

/**
 * Auslesen eines Schuelers anhand seiner ID.
 * 
 * @param {integer} id 
 * @returns {Promise<Object>} 
 */
export async function read(id) {
    let index = zweia.findIndex(zweia.db.data.Schueler, parseInt(id));
    if (index >= 0) return zweia.db.data.Schueler[index];
}

/**
 * Aktualisieren eines Schuelers durch Überschreiben einzelner Felder
 * oder des gesamten Schueler-Objekts.
 * 
 * @param {integer} id Schueler ID
 * @param {Object} schueler Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, schueler) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (schueler.vorname)     existing.vorname     = `${schueler.vorname}`.trim();
    if (schueler.nachname) existing.nachname = `${schueler.nachname}`.trim();
    

    validateSnippet(existing);
    await zweia.db.write();

    return existing;
}

/**
 * Löschen eines Schuelers anhand seiner ID.
 * 
 * @param {integer} id 
 * @returns {Promise<integer>} 
 */
export async function remove(id) {
    let countBefore = zweia.db.data.Schueler.length;
    zweia.db.data.schueler = zweia.db.data.Schueler.filter(entry => entry.id !== parseInt(id));
    let countAfter = zweia.db.data.Schueler.length;

    await zweia.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Schuelers. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Name fehlt").
 * 
 * @param {Object} schueler Zu prüfender Codeschnipsel
 */
function validateSnippet(schueler) {
    if (!schueler.vorname) throw new Error("Vorname fehlt");
   

    if (!schueler.nachname) schueler.nachname = "";
    schueler.nachname = schueler.nachname.toLowerCase();
    
    let nachname = zweia.db.data.Nachname.find(entry => entry.nachname === schueler.nachname);
    if (!nachname) throw new Error(`Unbekannte Nachname: ${schueler.nachname}`);
}

export default {search, create, read, update, remove};