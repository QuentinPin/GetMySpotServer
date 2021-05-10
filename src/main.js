// Import des module
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const BDDservice = require('./database/BDDservice')

//Variable d'environement
const IP_SERVER = process.env.IP_SERVER;
const PORT_SERVER = process.env.PORT_SERVER;

// Constante
const app = express();


function run() {
    app.use(bodyParser.json());

    /**
     * URL de création d'un compte utilisateur
     * @param pseudo pseudonyme de l'utilisateur à créer
     * @param password mot de passde de l'utilisateur à créer
     */
    app.post('/api/create_account', (req, res) => {
        var body = req.body;
        console.log("\n--> Création d'un utilisateur :\n\t- Json reçus : " + JSON.stringify(body));
        create_user(body, res);
    });

    app.listen(PORT_SERVER, IP_SERVER, () => {
        console.log(`Server is running at http://${IP_SERVER}:${PORT_SERVER}`);
    });
}

function create_user(body, res) {
    BDDservice.create_user_account(body.pseudo, body.password, function (err, results) {
        if (err) {
            console.log("\t- ERREUR LORS DE LA CREATION DE L'UTILISATEUR");
            res.writeHead(401,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 1, "user_id": null, "message": "User cannot be created" }));
        } else {
            console.log("\t- ID de l'utilisateur ajouté : " + results.insertId);
            res.writeHead(201,'Content-Type', 'application/json');
            res.end(JSON.stringify({ "error": 0, "user_id": results.insertId, "message": "User created" }));
        }
    });
}

// Export des fonction
exports.run = run;