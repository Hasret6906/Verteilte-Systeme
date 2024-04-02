import service     from "../services/schueler.service.js";
import {wrapAsync} from "../utils.js";
import {logger}    from "../utils.js";

const prefix = "/Schueler";

/**
 * Diese Funktion fügt die unten ausprogrammierten Route Handler der
 * Express Application hinzu.
 *
 * @param {Express.Application} app Express Application
 */
export default function registerRoutes(app) {
    // Ganze Collection
    app.get(prefix, wrapAsync(search));
    app.post(prefix, wrapAsync(create));

    // Einzelne Ressource
    app.get(`${prefix}/:id`, wrapAsync(read));
    app.put(`${prefix}/:id`, wrapAsync(update));
    app.patch(`${prefix}/:id`, wrapAsync(update));
    app.delete(`${prefix}/:id`, wrapAsync(remove));
};

/**
 * Abruf einer Liste von Schueler, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = [];
    let schuelers = await service.search(req.query.q);

    for (let schueler of schuelers || []) {
        result.push({
            id:       schueler.id,
            nachname: schueler.nachname,
            vorname:     schueler.vorname,
        });
    }

    res.status(200);
    res.send(result);
}

/**
 * Anlegen eines neuen Schuelers.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function create(req, res) {
    try {
        let result = await service.create(req.body);

        res.status(201);
        res.header("location", `${prefix}/${result.id}`);
        res.send(result);
    } catch (error) {
        logger.error(error);

        res.status(400);

        res.send({
            vorname:    error.vornamename    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Abruf eines einzelnen Schuelers anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function read(req, res) {
    let result = await service.read(req.params.id);

    if (result) {
        res.status(200);
        res.send(result);
    } else {
        logger.error(error);

        res.status(404);

        res.send({
            error:   "NOT-FOUND",
            message: "Der Codeschnipsel wurde nicht gefunden."
        });
    }
}

/**
 * Aktualisieren einzelner Felder eines Schuelers oder Überschreiben des
 * gesamten Schuelers.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function update(req, res) {
    try {
        let result = await service.update(req.params.id, req.body);

        if (result) {
            res.status(200);
            res.send(result);
        } else {
            res.status(404);

            res.send({
                error:   "NOT-FOUND",
                message: "Der Codeschnipsel wurde nicht gefunden."
            });
        }
    } catch (error) {
        logger.error(error);
        
        res.status(400);

        res.send({
            vorname:    error.vorname    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Löschen eines Schuelers anhand seiner ID.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function remove(req, res) {
    let count = await service.remove(req.params.id);

    if (count > 0) {
        res.status(204);
        res.send();
    } else {
        res.status(404);

        res.send({
            error:   "NOT-FOUND",
            message: "Der Codeschnipsel wurde nicht gefunden."
        });
    }
}
