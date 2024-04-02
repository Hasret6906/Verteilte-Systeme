import schuelerController from "./schueler.controller.js";
import lehrerController  from "./lehrer.controller.js";
import kursController  from "./kurs.controller.js";


// Reexport alle Controller, um die main.js nicht anpassen zu müssen,
// wenn künftig ein neuer Controller hinzugefügt wird.
export default [
    schuelerController,
    lehrerController,
    kursController,
];