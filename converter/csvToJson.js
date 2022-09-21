let csvToJson = require('convert-csv-to-json');

let fileInputName = '../db/prasekolah_dataperlis.csv';
let fileOutputName = '../db/prasekolah.json';

csvToJson.generateJsonFileFromCsv(fileInputName, fileOutputName);
// csvToJson.parseSubArray(',').getJsonFromCsv(fileInputName);
