import service     from "../services/lehrer.service.js";
import {wrapAsync} from "../utils.js";
import {logger}    from "../utils.js";

const prefix = "/Lehrer";

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
 * Abruf einer Liste von Lehrern, optional mit Stichwortsuche.
 *
 * @param {Express.Request} req HTTP-Anfrage
 * @param {Express.Response} res HTTP-Antwort
 */
async function search(req, res) {
    let result = [];
    let lehrers = await service.search(req.query.q);

    for (let lehrer of lehrers || []) {
        result.push({
            id:       lehrer.id,
            nachname: lehrer.nachname,
            vorname:     lehrer.vorname,
        });
    }

    res.status(200);
    res.send(result);
}

/**
 * Anlegen eines neuen Lehrers
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
            name:    error.name    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Abruf eines einzelnen Lehrers anhand seiner ID.
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
 * Aktualisieren einzelner Felder eines Lehrers oder Überschreiben des
 * gesamten Lehrers.
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
            name:    error.name    || "Error",
            message: error.message || "",
        });
    }
}

/**
 * Löschen eines Lehrers anhand seiner ID.
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
