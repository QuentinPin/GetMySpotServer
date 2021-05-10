// Import des module
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

//Variable d'environement
const IP_SERVER = process.env.IP_SERVER;
const PORT_SERVER = process.env.PORT_SERVER;

// Constante
const app = express();

function run() {
    app.use(bodyParser.json());

    app.listen(PORT_SERVER, IP_SERVER, () => {
        console.log(`Server is running at http://${IP_SERVER}:${PORT_SERVER}`);
    });
}

// Export des fonction
exports.run = run;