import zweia from "../zweia.js";

/**
 * @param {string} query Suchbegriff
 * @returns {Promise<Object[]>} Gefundene Lehrer
 */
export async function search(query) {
    let result = zweia.db.data.Lehrer;

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
 * Anlegen eines neuen Lehrers.
 * 
 * @param {Object} lehrer Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten
 */
export async function create(lehrer) {
    if (!lehrer) return;

    let entry = {
        id:       zweia.getNextId(zweia.db.data.Lehrer),
        nachname: `${lehrer.nachname || ""}`.trim(),
        name:     `${lehrer.name     || ""}`.trim(),
        
    };

    validateSnippet(entry);
    zweia.db.data.Lehrer.push(entry);
    await zweia.db.write();

    return entry;
}

/**
 * Auslesen eines Lehrers anhand seiner ID.
 * 
 * @param {integer} id 
 * @returns {Promise<Object>} 
 */
export async function read(id) {
    let index = zweia.findIndex(zweia.db.data.Lehrer, parseInt(id));
    if (index >= 0) return zweia.db.data.Lehrer[index];
}

/**
 * Aktualisieren eines Lehrers durch Überschreiben einzelner Felder
 * oder des gesamten Lehrer-Objekts.
 * 
 * @param {integer} id Lehrer ID
 * @param {Object} lehrer Zu speichernde Daten
 * @returns {Promise<Object>} Gespeicherte Daten oder undefined
 */
export async function update(id, lehrer) {
    let existing = await read(parseInt(id));
    if (!existing) return;

    if (lehrer.vorname)     existing.vorname     = `${lehrer.vorname}`.trim();
    if (lehrer.nachname) existing.nachname = `${lehrer.nachname}`.trim();
    

    validateSnippet(existing);
    await zweia.db.write();

    return existing;
}

/**
 * Löschen eines Lehrers anhand seiner ID.
 * 
 * @param {integer} id Lehrer ID
 * @returns {Promise<integer>} Anzahl der gelöschten Datensätze
 */
export async function remove(id) {
    let countBefore = zweia.db.data.Lehrer.length;
    zweia.db.data.Lehrer = zweia.db.data.Lehrer.filter(entry => entry.id !== parseInt(id));
    let countAfter = zweia.db.data.Lehrer.length;

    await zweia.db.write();
    return countBefore - countAfter;
}

/**
 * Diese Funktion prüft die Inhalte eines Lehrers. Wenn alles in Ordnung ist,
 * passiert nichts. Wenn ein Fehler gefunden wird, wirft sie eine Exception mit einer
 * entsprechenden Fehlermeldung (z.B. "Name fehlt").
 * 
 * @param {Object} lehrer Zu prüfender Lehrer
 */
function validateSnippet(lehrer) {
    if (!lehrer.vorname) throw new Error("Vorame fehlt");
    

    if (!lehrer.nachname) lehrer.nachname = "";
    lehrer.nachname = lehrer.nachname.toLowerCase();
    
    let nachname = zweia.db.data.Nachname.find(entry => entry.nachname === lehrer.nachname);
    if (!nachname) throw new Error(`Unbekannte Vorname: ${lehrer.nachname}`);
}

export default {search, create, read, update, remove};
